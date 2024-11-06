// Professor.js
import React, { useState, useEffect } from 'react';
import './Professor.css';
import * as XLSX from 'xlsx';

function Professor() {
    const [rollNumbers, setRollNumbers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]); // Array to hold attendance records
    const [presentCounts, setPresentCounts] = useState({}); // Track present counts for each roll number
    const [totalDays, setTotalDays] = useState(0); // Track total days of attendance marked

    
    useEffect(() => {
        const savedRollNumbers = JSON.parse(localStorage.getItem('rollNumbers'));
        if (savedRollNumbers) {
            setRollNumbers(savedRollNumbers);
            const initialAttendance = savedRollNumbers.reduce((acc, roll) => {
                acc[roll] = false; // Initially mark all as absent
                return acc;
            }, {});
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

       
        const currentAttendanceData = {};
        rollNumbers.forEach(roll => {
            currentAttendanceData[roll] = attendance[roll] ? 'Present' : 'Absent';
            // Update present counts
            if (attendance[roll]) {
                setPresentCounts((prev) => ({
                    ...prev,
                    [roll]: (prev[roll] || 0) + 1 // Increment present count for this roll number
                }));
            }
        });


        // Add the current attendance data to the records with the date
        const newAttendanceRecord = { date, attendance: currentAttendanceData };
        const updatedAttendanceRecords = [...attendanceRecords, newAttendanceRecord];
        setAttendanceRecords(updatedAttendanceRecords);
        setTotalDays(updatedAttendanceRecords.length); // Update total days count

        // Reset attendance after submission
        const resetAttendance = rollNumbers.reduce((acc, roll) => {
            acc[roll] = false; // Reset all to absent
            return acc;
        }, {});
        setAttendance(resetAttendance);

        alert('Attendance submitted successfully for ' + date + '!');
    };

    const downloadExcel = () => {
        // Create a structure for the Excel sheet
        const excelData = [];
        const headerRow = ['Roll Number', ...attendanceRecords.map(record => record.date), 'Total Present', 'Total Absent', 'Present Percentage'];

        // Prepare rows for each roll number
        rollNumbers.forEach(roll => {
            const row = [roll]; // Start with roll number
            attendanceRecords.forEach(record => {
                row.push(record.attendance[roll] || 'Absent'); // Add attendance status or 'Absent' if not found
            });

            // Calculate totals for present and absent
            const presentCount = presentCounts[roll] || 0;
            const absentCount = totalDays - presentCount;

            // Add totals and present percentage to the row
            const presentPercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) + '%' : '0%';
            row.push(presentCount, absentCount, presentPercentage);
            excelData.push(row);
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...excelData]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

        // Create a file and trigger the download
        XLSX.writeFile(workbook, 'Attendance_Report.xlsx');
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
        // Reset attendance when a new date is selected
        const initialAttendance = rollNumbers.reduce((acc, roll) => {
            acc[roll] = false; // All initially marked as absent
            return acc;
        }, {});
        setAttendance(initialAttendance);
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
                <button type="button" onClick={downloadExcel}>Download Attendance Report</button>
            </form>
        </div>
    );
}

export default Professor;
