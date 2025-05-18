import React, { useState, useEffect } from 'react';
import './Attendance.css';

function Attendance() {
    const [rollNumbers, setRollNumbers] = useState([]);
    const [presentRolls, setPresentRolls] = useState(new Set());

    useEffect(() => {
        const savedRollNumbers = JSON.parse(localStorage.getItem('rollNumbers')) || [];
        setRollNumbers(savedRollNumbers);
    }, []);

    const handleCheckboxChange = (roll) => {
        setPresentRolls(prev => {
            const newSet = new Set(prev);
            if (newSet.has(roll)) {
                newSet.delete(roll);
            } else {
                newSet.add(roll);
            }
            return newSet;
        });
    };

    const handleSubmitAttendance = () => {
        const presentees = presentRolls.size;
        const absentees = rollNumbers.length - presentees;
        const attendancePercentage = ((presentees / rollNumbers.length) * 100).toFixed(2);

        alert(
            `Total Presentees: ${presentees}\n` +
            `Total Absentees: ${absentees}\n` +
            `Attendance Percentage: ${attendancePercentage}%`
        );
    };

    return (
        <div className="attendance">
            <h2>Attendance</h2>
            <ul>
                {rollNumbers.map((roll, index) => (
                    <li key={index}>
                        <label>
                            <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(roll)}
                            />
                            {roll}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmitAttendance}>Submit Attendance</button>
        </div>
    );
}

export default Attendance;