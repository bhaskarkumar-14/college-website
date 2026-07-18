import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/auth';

async function runTests() {
    console.log("--- Starting Batch Attendance Verification ---");
    console.log(`Targeting: ${BASE_URL}`);

    // 1. Login Faculty
    console.log("\n1. Logging in Faculty...");
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

    // 2. Fetch Students list
    console.log("\n2. Fetching student records for CSE branch...");
    const studentsRes = await fetch(`${BASE_URL}/faculty/students?branch=CSE&session=2022-26`, {
        headers: { Authorization: `Bearer ${facultyToken}` }
    });
    const students = await studentsRes.json();
    if (!studentsRes.ok || students.length === 0) {
        console.error("❌ Failed to fetch students:", students);
        return;
    }
    console.log(`✅ Loaded ${students.length} students.`);

    // Keep reference of current attendance statistics of the target students
    const targetStudent1 = students.find(s => s.studentId === "PEC/CSE/22/045"); // Bhaskar Jha
    if (!targetStudent1) {
        console.error("❌ Target student PEC/CSE/22/045 not found.");
        return;
    }

    const subjectName = "Advanced Computer Architecture";
    const subRecordBefore = targetStudent1.academicAttendance.find(sub => sub.subjectName === subjectName) || { totalLectures: 0, attendedLectures: 0 };
    console.log(`\nBhaskar Jha Before: Total=${subRecordBefore.totalLectures}, Attended=${subRecordBefore.attendedLectures}`);

    // 3. Submit Batch Attendance
    console.log("\n3. Submitting Batch Attendance Sheet (Bhaskar Jha -> Present, others -> Absent)...");
    const attendanceData = students.map(student => ({
        studentId: student._id,
        status: student.studentId === "PEC/CSE/22/045" ? "Present" : "Absent"
    }));

    const batchRes = await fetch(`${BASE_URL}/faculty/attendance/batch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${facultyToken}`
        },
        body: JSON.stringify({
            subjectName,
            attendanceData
        })
    });

    const batchResult = await batchRes.json();
    if (!batchRes.ok) {
        console.error("❌ Batch Attendance Submission Failed:", batchResult);
        return;
    }
    console.log("✅ Batch Attendance logged successfully. Records processed:", batchResult.recordsProcessed);

    // 4. Fetch Students list again and verify increments
    console.log("\n4. Verifying attendance database updates...");
    const verifyRes = await fetch(`${BASE_URL}/faculty/students?branch=CSE&session=2022-26`, {
        headers: { Authorization: `Bearer ${facultyToken}` }
    });
    const verifyStudents = await verifyRes.json();
    const targetStudentAfter = verifyStudents.find(s => s.studentId === "PEC/CSE/22/045");

    const subRecordAfter = targetStudentAfter.academicAttendance.find(sub => sub.subjectName === subjectName);
    console.log(`Bhaskar Jha After: Total=${subRecordAfter.totalLectures}, Attended=${subRecordAfter.attendedLectures}`);

    const totalDiff = subRecordAfter.totalLectures - subRecordBefore.totalLectures;
    const attendedDiff = subRecordAfter.attendedLectures - subRecordBefore.attendedLectures;

    if (totalDiff === 1 && attendedDiff === 1) {
        console.log("✅ SUCCESS: Bhaskar Jha (Present) attendance incremented correctly!");
    } else {
        console.error(`❌ FAILURE: Expected Bhaskar Jha to increment by 1/1, got ${totalDiff}/${attendedDiff}`);
        return;
    }

    // Verify one of the absent students if there are multiple students
    if (students.length >= 2) {
        const absentStudentBefore = students.find(s => s.studentId !== "PEC/CSE/22/045");
        const absentStudentAfter = verifyStudents.find(s => s.studentId === absentStudentBefore.studentId);
        const subRecordBeforeAbsent = absentStudentBefore.academicAttendance.find(sub => sub.subjectName === subjectName) || { totalLectures: 0, attendedLectures: 0 };
        const subRecordAfterAbsent = absentStudentAfter.academicAttendance.find(sub => sub.subjectName === subjectName) || { totalLectures: 0, attendedLectures: 0 };

        const totalDiffAbsent = subRecordAfterAbsent.totalLectures - subRecordBeforeAbsent.totalLectures;
        const attendedDiffAbsent = subRecordAfterAbsent.attendedLectures - subRecordBeforeAbsent.attendedLectures;

        if (totalDiffAbsent === 1 && attendedDiffAbsent === 0) {
            console.log(`✅ SUCCESS: Student ${absentStudentBefore.fullName} (Absent) total incremented by 1, attended remained unchanged!`);
        } else {
            console.error(`❌ FAILURE: Expected absent student to increment total by 1 and attended by 0, got ${totalDiffAbsent}/${attendedDiffAbsent}`);
            return;
        }
    } else {
        console.log("ℹ️ Skipping absent student check (only 1 student exists in this class).");
    }

    console.log("\n🎉 ALL BATCH ATTENDANCE TESTS PASSED SUCCESSFULLY! ✅");
}

runTests().catch(err => console.error("Unhandled test error:", err));
