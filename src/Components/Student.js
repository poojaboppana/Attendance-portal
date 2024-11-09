import React, { useState } from 'react';
import './Student.css'
function Student() {
    const [rollNumber, setRollNumber] = useState('');
    const [attendanceInfo, setAttendanceInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/attendance/${rollNumber}`);
            if (response.ok) {
                const data = await response.json();
                setAttendanceInfo(data);
            } else {
                setError('Roll number not found.');
            }
        } catch (error) {
            setError('Error retrieving attendance.');
        } finally {
            setLoading(false);
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
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {attendanceInfo && (
                <div>
                    <p>Present Days: {attendanceInfo.presentCount}</p>
                    <p>Absent Days: {attendanceInfo.absentCount}</p>
                    <p>Total Days: {attendanceInfo.totalDays}</p>
                    <p>Attendance Percentage: {attendanceInfo.presentPercentage}</p>
                </div>
            )}
        </div>
    );
}

export default Student;
