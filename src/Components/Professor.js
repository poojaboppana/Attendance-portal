import React, { useState, useEffect } from 'react';
import './Professor.css';
import * as XLSX from 'xlsx';

function Professor() {
    const [rollNumbers, setRollNumbers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [date, setDate] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState({}); // Object to hold all attendance records

    useEffect(() => {
        const savedRollNumbers = JSON.parse(localStorage.getItem('rollNumbers'));
        if (savedRollNumbers) {
            setRollNumbers(savedRollNumbers);
            // Initialize attendance state
            const initialAttendance = {};
            savedRollNumbers.forEach(roll => {
                initialAttendance[roll] = false; // All initially marked as absent
            });
            setAttendance(initialAttendance);
        }
    }, []);

    const handleCheckboxChange = (rollNumber) => {
        setAttendance((prev) => ({
            ...prev,
            [rollNumber]: !prev[rollNumber]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date) {
            alert('Please enter a date to mark attendance.');
            return;
        }

        // Prepare data for the current attendance
        const currentAttendanceData = {};
        rollNumbers.forEach(roll => {
            currentAttendanceData[roll] = attendance[roll] ? 'Present' : 'Absent';
        });

        // Add the current attendance data to the records
        setAttendanceRecords(prev => ({
            ...prev,
            [date]: currentAttendanceData // Use date as key
        }));

        // Download the Excel file
        downloadExcel();

        // Reset attendance after submission
        setAttendance((prev) => {
            const resetAttendance = { ...prev };
            rollNumbers.forEach(roll => {
                resetAttendance[roll] = false; // Reset attendance
            });
            return resetAttendance;
        });

        setSubmitted(true); // Mark submitted as true
        alert('Attendance submitted successfully for ' + date + '!');
    };

    const downloadExcel = () => {
        // Create a structure for the Excel sheet
        const excelData = [];
        const headerRow = ['Roll Number', ...Object.keys(attendanceRecords)];

        // Prepare rows for each roll number
        rollNumbers.forEach(roll => {
            const row = [roll]; // Start with roll number
            for (const date in attendanceRecords) {
                row.push(attendanceRecords[date][roll] || 'Absent'); // Add attendance status or 'Absent' if not found
            }
            excelData.push(row);
        });

        // Calculate total presentees and total absentees
        const totalPresent = rollNumbers.map(roll => {
            return Object.values(attendanceRecords).filter(data => data[roll] === 'Present').length;
        });
        const totalAbsent = rollNumbers.map(roll => {
            return Object.values(attendanceRecords).filter(data => data[roll] === 'Absent').length;
        });

        // Calculate final totals
        const finalTotalPresent = totalPresent.reduce((sum, count) => sum + count, 0);
        const finalTotalAbsent = totalAbsent.reduce((sum, count) => sum + count, 0);

        // Add totals in the last two rows
        excelData.push(['Total Present', finalTotalPresent]);
        excelData.push(['Total Absent', finalTotalAbsent]);

        const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...excelData]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

        // Create a file and trigger the download
        XLSX.writeFile(workbook, `Attendance_${new Date().toLocaleDateString()}.xlsx`);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
        // Reset attendance when a new date is selected
        const initialAttendance = {};
        rollNumbers.forEach(roll => {
            initialAttendance[roll] = false; // All initially marked as absent
        });
        setAttendance(initialAttendance);
        setSubmitted(false); // Reset submitted status for a new date
    };

    return (
        <div className="professor">
            <h2>Mark Attendance</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            required
                        />
                    </label>
                </div>
                <div className="roll-list">
                    <ul>
                        {rollNumbers.map((roll, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={attendance[roll] || false}
                                        onChange={() => handleCheckboxChange(roll)}
                                    />
                                    {roll}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Submit Attendance</button>
            </form>

            {submitted && (
                <div>
                    <h4>Attendance Summary:</h4>
                    <p>Present: {rollNumbers.filter(roll => attendance[roll]).length}</p>
                    <p>Absent: {rollNumbers.filter(roll => !attendance[roll]).length}</p>
                </div>
            )}
        </div>
    );
}

export default Professor;
