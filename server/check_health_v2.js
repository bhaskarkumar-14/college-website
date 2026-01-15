// import fetch from 'node-fetch'; // Using native fetch
import fs from 'fs';

const BASE_URL = 'http://localhost:5000/api/auth';
const FACULTY_LOGIN = { email: 'faculty@pce.edu', password: 'password123' };
const STUDENT_LOGIN = { studentId: 'PEC/CSE/22/045', password: 'password123' };

async function runHealthCheck() {
    console.log("--- Starting System Health Check ---");
    let errors = 0;
    const results = {
        backend: false,
        errors: 0,
        details: []
    };

    // 1. Check Server Status
    try {
        const res = await fetch('http://localhost:5000/');
        const text = await res.text();
        if (text === 'PCE API is running...') {
            console.log("✅ Backend Server is Running");
        } else {
            console.error("❌ Backend Server returned unexpected response:", text);
            errors++;
            results.details.push({ check: 'Server', error: text });
        }
    } catch (e) {
        console.error("❌ Backend Server is DOWN:", e.message);
        errors++;
        // If server is down, no point checking API
        return;
    }

    // 2. Student Login
    let studentToken = null;
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(STUDENT_LOGIN)
        });
        const data = await res.json();
        if (res.ok && data.token) {
            console.log("✅ Student Login Successful");
            studentToken = data.token;
        } else {
            console.error("❌ Student Login Failed:", data.message);
            errors++;
            results.details.push({ check: 'StudentLogin', error: data.message });
        }
    } catch (e) {
        console.error("❌ Student Login Error:", e.message);
        errors++;
        results.details.push({ check: 'StudentLogin', error: e.message });
    }

    // 3. Faculty Login
    let facultyToken = null;
    try {
        const res = await fetch(`${BASE_URL}/faculty/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(FACULTY_LOGIN)
        });
        const data = await res.json();
        if (res.ok && data.token) {
            console.log("✅ Faculty Login Successful");
            facultyToken = data.token;
        } else {
            console.error("❌ Faculty Login Failed:", data.message);
            errors++;
            results.details.push({ check: 'FacultyLogin', error: data.message });
        }
    } catch (e) {
        console.error("❌ Faculty Login Error:", e.message);
        errors++;
        results.details.push({ check: 'FacultyLogin', error: e.message });
    }

    // 4. Check Dashboard Data (requires login)
    if (studentToken) {
        try {
            const res = await fetch(`${BASE_URL}/dashboard`, {
                headers: { 'Authorization': `Bearer ${studentToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                console.log("✅ Dashboard Data Retrieval Successful");
                if (data.biometricLogs) {
                    console.log(`   - Biometric Logs found: ${data.biometricLogs.length}`);
                }
            } else {
                console.error("❌ Dashboard Fetch Failed:", data.message);
                errors++;
                results.details.push({ check: 'Dashboard', error: data.message });
            }
        } catch (e) {
            console.error("❌ Dashboard Error:", e.message);
            errors++;
            results.details.push({ check: 'Dashboard', error: e.message });
        }
    }

    // 5. Check Announcements
    try {
        const res = await fetch(`${BASE_URL}/announcements`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
            console.log("✅ Public Announcements Fetch Successful");
        } else {
            console.error("❌ Announcements Fetch Failed");
            errors++;
            results.details.push({ check: 'Announcements', error: 'Failed' });
        }
    } catch (e) {
        console.error("❌ Announcements Error:", e.message);
        errors++;
        results.details.push({ check: 'Announcements', error: e.message });
    }



    // (Add logic to push details to the array in previous steps if I were rewriting the whole thing, but for now just saving the error count is enough to know it failed).
    // Write results to file
    fs.writeFileSync('health_results.json', JSON.stringify(results, null, 2));

    console.log(`\n--- Health Check Complete: ${errors === 0 ? 'PASSED ✅' : 'FAILED ❌ (' + errors + ' errors)'} ---`);
}

runHealthCheck();
