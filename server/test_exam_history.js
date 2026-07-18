const BASE_URL = 'http://localhost:5000/api/auth';

async function runTests() {
    console.log("--- Starting Exam History Verification ---");
    console.log(`Targeting: ${BASE_URL}`);

    // 1. Student Login
    console.log("\n1. Logging in Student...");
    const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: "PEC/CSE/22/045", password: "password123" })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
        console.error("❌ Student Login Failed:", loginData);
        return;
    }
    console.log("✅ Student Login Success:", loginData.email);
    const studentToken = loginData.token;

    // 2. Fetch Available Exams
    console.log("\n2. Fetching Available Exams...");
    const examsRes = await fetch(`${BASE_URL}/exams`, {
        headers: { Authorization: `Bearer ${studentToken}` }
    });
    const exams = await examsRes.json();
    if (!examsRes.ok || exams.length === 0) {
        console.error("❌ Failed to fetch exams or no exams seeded:", exams);
        return;
    }
    console.log(`✅ Fetched ${exams.length} exams. First exam title: "${exams[0].title}"`);
    const exam = exams[0];

    // 3. Submit Exam Attempt
    console.log("\n3. Submitting Exam Attempt...");
    const attemptPayload = {
        examId: exam._id,
        examTitle: exam.title,
        score: exam.questions.length - 1,
        totalQuestions: exam.questions.length,
        timeTaken: 120, // 2 minutes
        attemptedCount: exam.questions.length
    };
    const submitRes = await fetch(`${BASE_URL}/exams/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${studentToken}`
        },
        body: JSON.stringify(attemptPayload)
    });
    const resText = await submitRes.text();
    console.log(`Submit response status: ${submitRes.status}`);
    if (!submitRes.ok) {
        console.error("❌ Failed to submit exam attempt. Response text:", resText);
        return;
    }
    const submitData = JSON.parse(resText);
    console.log("✅ Exam Attempt Submitted Successfully!");

    // 4. Verify Dashboard has Exam Attempts
    console.log("\n4. Verifying Student Dashboard updates...");
    const dashboardRes = await fetch(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${studentToken}` }
    });
    const dashboardData = await dashboardRes.json();
    if (!dashboardRes.ok) {
        console.error("❌ Failed to fetch dashboard data:", dashboardData);
        return;
    }
    const attempts = dashboardData.examAttempts || [];
    console.log(`✅ Student Dashboard returns ${attempts.length} attempts.`);
    const lastAttempt = attempts[attempts.length - 1];
    if (lastAttempt && lastAttempt.examTitle === exam.title) {
        console.log(`✅ Dashboard attempt match: score ${lastAttempt.score}/${lastAttempt.totalQuestions}`);
    } else {
        console.error("❌ Dashboard attempt mismatch or empty:", lastAttempt);
        return;
    }

    // 5. Login Faculty & Verify attempts are audited in Faculty Portal
    console.log("\n5. Logging in Faculty...");
    const facultyLoginRes = await fetch(`${BASE_URL}/faculty/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "faculty@pce.edu", password: "password123" })
    });
    const facultyLoginData = await facultyLoginRes.json();
    if (!facultyLoginRes.ok) {
        console.error("❌ Faculty Login Failed:", facultyLoginData);
        return;
    }
    console.log("✅ Faculty Login Success:", facultyLoginData.email);
    const facultyToken = facultyLoginData.token;

    // 6. Fetch Student directory from Faculty endpoint
    console.log("\n6. Fetching Students as Faculty to audit exam records...");
    const studentsRes = await fetch(`${BASE_URL}/faculty/students?branch=CSE`, {
        headers: { Authorization: `Bearer ${facultyToken}` }
    });
    const students = await studentsRes.json();
    if (!studentsRes.ok || students.length === 0) {
        console.error("❌ Failed to fetch student records:", students);
        return;
    }
    
    // Find the logged-in student (studentId: PEC/CSE/22/045 or similar)
    const auditedStudent = students.find(s => s.studentId === "PEC/CSE/22/045");
    if (!auditedStudent) {
        console.error("❌ Did not find student record in CSE branch listing.");
        return;
    }
    
    const auditedAttempts = auditedStudent.examAttempts || [];
    console.log(`✅ Faculty audits student: found ${auditedAttempts.length} practice exam attempts.`);
    const matchingAttempt = auditedAttempts.find(a => a.examId === exam._id);
    if (matchingAttempt) {
        console.log(`✅ Faculty successfully verified student attempt log: Score: ${matchingAttempt.score}/${matchingAttempt.totalQuestions}, Time Taken: ${matchingAttempt.timeTaken}s`);
    } else {
        console.error("❌ Did not find matching attempt record in audited student's list.");
        return;
    }

    console.log("\n--- All Verification Tests Passed! ✅ ---");
}

runTests();
