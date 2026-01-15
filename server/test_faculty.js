

const BASE_URL = 'http://localhost:5000/api/auth';
let token = '';
let studentId = '';

const facultyUser = {
    fullName: "Dr. Debugger",
    email: `debug_${Date.now()}@pce.ac.in`,
    password: "password123",
    department: "CSE",
    designation: "Professor"
};

async function runTests() {
    console.log("--- Starting Faculty Debugging ---");
    console.log(`Targeting: ${BASE_URL}`);

    // 1. Register Faculty
    console.log("\n1. Registering Faculty...");
    const regRes = await fetch(`${BASE_URL}/faculty/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyUser)
    });
    const regData = await regRes.json();
    if (regRes.ok) {
        console.log("✅ Registration Success:", regData.email);
        token = regData.token;
    } else {
        console.error("❌ Registration Failed:", regData);
        return; // Stop if registration fails
    }

    // 2. Login Faculty (Optional if token returned, but good to test)
    console.log("\n2. Logging in Faculty...");
    const loginRes = await fetch(`${BASE_URL}/faculty/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: facultyUser.email, password: facultyUser.password })
    });
    const loginData = await loginRes.json();
    if (loginRes.ok) {
        console.log("✅ Login Success:", loginData.email);
        token = loginData.token; // Update token just in case
    } else {
        console.error("❌ Login Failed:", loginData);
    }

    // 3. Fetch Students (Filter)
    console.log("\n3. Fetching Students (CSE / 2022-26)...");
    const studRes = await fetch(`${BASE_URL}/faculty/students?branch=CSE&session=2022-26`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const students = await studRes.json();
    if (studRes.ok && Array.isArray(students)) {
        console.log(`✅ Fetched ${students.length} students.`);
        if (students.length > 0) {
            studentId = students[0]._id;
            console.log(`   Targeting Student: ${students[0].fullName} (${studentId})`);
        } else {
            console.warn("⚠️ No students found to test modification.");
            return;
        }
    } else {
        console.error("❌ Fetch Failed:", students);
    }

    // 4. Modify Subject (Add)
    console.log("\n4. Adding New Subject 'Advanced AI'...");
    const addSubRes = await fetch(`${BASE_URL}/faculty/subject`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            studentId,
            subjectName: "Advanced AI",
            action: 'add',
            totalLectures: 50
        })
    });
    const addData = await addSubRes.json();
    if (addSubRes.ok) {
        const hasSubject = addData.academicAttendance.some(s => s.subjectName === 'Advanced AI');
        console.log(hasSubject ? "✅ Subject Added Successfully" : "❌ Subject Not Found in Response");
    } else {
        console.error("❌ Add Subject Failed:", addData);
    }

    // 5. Update Attendance
    console.log("\n5. Marking Attendance for 'Advanced AI'...");
    const attRes = await fetch(`${BASE_URL}/faculty/attendance`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            studentId,
            subjectName: "Advanced AI",
            incrementAttended: 1,
            incrementTotal: 1
        })
    });
    const attData = await attRes.json();
    if (attRes.ok) {
        const subject = attData.academicAttendance.find(s => s.subjectName === 'Advanced AI');
        console.log(`✅ Attendance Updated: ${subject.attendedLectures}/${subject.totalLectures}`);
    } else {
        console.error("❌ Attendance Update Failed:", attData);
    }

    // 6. Modify Subject (Remove)
    console.log("\n6. Removing Subject 'Advanced AI'...");
    const remRes = await fetch(`${BASE_URL}/faculty/subject`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            studentId,
            subjectName: "Advanced AI",
            action: 'remove'
        })
    });
    const remData = await remRes.json();
    if (remRes.ok) {
        const hasSubject = remData.academicAttendance.some(s => s.subjectName === 'Advanced AI');
        console.log(!hasSubject ? "✅ Subject Removed Successfully" : "❌ Subject Still Exists");
    } else {
        console.error("❌ Remove Subject Failed:", remData);
    }

    console.log("\n--- Tests Completed ---");
}

runTests();
