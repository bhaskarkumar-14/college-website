
const BASE_URL = 'http://localhost:5000/api/auth';

async function run() {
    console.log("--- Reproduction Script: Subject Management ---");

    // 1. Login Logic (Hardcoded for speed, assuming seeded or prev created)
    // We'll just register a temp faculty to be sure
    const facultyEmail = `bugcheck_${Date.now()}@pce.edu`;
    const password = 'password123';

    console.log("1. Registering Faculty...");
    const regRes = await fetch(`${BASE_URL}/faculty/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: "Bug Check",
            email: facultyEmail,
            password: password,
            department: "CSE",
            designation: "Tester"
        })
    });
    const regData = await regRes.json();
    if (!regRes.ok) {
        console.error("Reg Failed:", regData);
        return;
    }
    const token = regData.token;

    // 2. Get Student
    console.log("2. Fetching Student...");
    const studRes = await fetch(`${BASE_URL}/faculty/students?branch=CSE&session=2022-26`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const students = await studRes.json();
    if (!students.length) {
        console.error("No students found.");
        return;
    }
    const studentId = students[0]._id;
    console.log(`   Student: ${students[0].fullName} (${studentId})`);

    // 3. Add Subject
    console.log("3. Adding Subject 'BugTest'...");
    const addRes = await fetch(`${BASE_URL}/faculty/subject`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            studentId,
            subjectName: "BugTest",
            action: 'add'
        })
    });
    const addData = await addRes.json();
    const added = addData.academicAttendance.some(s => s.subjectName === 'BugTest');
    console.log(added ? "✅ Added" : "❌ Failed to Add");

    // 4. Remove Subject
    console.log("4. Removing Subject 'BugTest'...");
    const remRes = await fetch(`${BASE_URL}/faculty/subject`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            studentId,
            subjectName: "BugTest",
            action: 'remove'
        })
    });
    const remData = await remRes.json();
    const removed = !remData.academicAttendance.some(s => s.subjectName === 'BugTest');
    console.log(removed ? "✅ Removed" : "❌ Failed to Remove (Bug Confirmed)");
}

run().catch(console.error);
