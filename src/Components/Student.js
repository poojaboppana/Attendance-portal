import React, { useState } from 'react';
import './Student.css';

function Student() {
    const [rollNumber, setRollNumber] = useState('');
    const [attendanceInfo, setAttendanceInfo] = useState(null);

    const handleCheckAttendance = async () => {
        try {
            const response = await fetch(`http://localhost:5000/attendance/${rollNumber}`);
            if (response.ok) {
                const data = await response.json();
                setAttendanceInfo(data);
            } else {
                alert('Roll number not found.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="user">
            <h2>Check Attendance</h2>
            <input
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
            />
            <button onClick={handleCheckAttendance}>Check Attendance</button>
            {attendanceInfo && (
                <div>
                    <p>Present Days: {attendanceInfo.presentCount}</p>
                    <p>Absent Days: {attendanceInfo.absentCount}</p>
                    <p>Total Days: {attendanceInfo.totalDays}</p>
                    <p>Attendance Percentage: {attendanceInfo.attendancePercentage}</p>
                </div>
            )}
        </div>
    );
}

export default Student;
