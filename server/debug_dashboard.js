


const login = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: 'PEC/CSE/22/045', password: 'password123' })
        });
        const data = await res.json();
        console.log('Login Status:', res.status);
        if (!res.ok) {
            console.log('Login Error:', data);
            return;
        }

        console.log('Token received.');
        const token = data.token;

        const dashboardRes = await fetch('http://localhost:5000/api/auth/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const dashboardData = await dashboardRes.json();
        console.log('Dashboard Data Status:', dashboardRes.status);
        console.log('Dashboard Data Keys:', Object.keys(dashboardData));
        if (dashboardData.academicAttendance) {
            console.log('academicAttendance type:', typeof dashboardData.academicAttendance);
            console.log('academicAttendance isArray:', Array.isArray(dashboardData.academicAttendance));
        } else {
            console.log('academicAttendance is MISSING');
        }

    } catch (err) {
        console.error(err);
    }
};

login();
