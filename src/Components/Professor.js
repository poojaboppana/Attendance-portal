import React, { useState, useEffect } from 'react';
import './Professor.css';
import * as XLSX from 'xlsx';

function Professor() {
    const [rollNumbers, setRollNumbers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [presentCounts, setPresentCounts] = useState({});
    const [totalDays, setTotalDays] = useState(0);

    useEffect(() => {
        const savedRollNumbers = JSON.parse(localStorage.getItem('rollNumbers'));
        const lastUpdated = localStorage.getItem('lastUpdated');
        const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;

        if (savedRollNumbers) {
            setRollNumbers(savedRollNumbers);
            const initialAttendance = {};
            savedRollNumbers.forEach(roll => {
                initialAttendance[roll] = false;
            });
            setAttendance(initialAttendance);

            const currentTime = new Date().getTime();
            if (!lastUpdated || currentTime - lastUpdated > oneYearInMillis) {
                setAttendanceRecords([]);
                setPresentCounts({});
                setTotalDays(0);
            } else {
                const savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords'));
                if (savedAttendanceRecords) {
                    setAttendanceRecords(savedAttendanceRecords);
                    setTotalDays(savedAttendanceRecords.length);
                    const updatedPresentCounts = savedAttendanceRecords.reduce((counts, record) => {
                        Object.keys(record.attendance).forEach(roll => {
                            if (record.attendance[roll] === 'Present') {
                                counts[roll] = (counts[roll] || 0) + 1;
                            }
                        });
                        return counts;
                    }, {});
                    setPresentCounts(updatedPresentCounts);
                }
            }
        }
    }, []);

    const handleCheckboxChange = (rollNumber) => {
        setAttendance((prev) => ({
            ...prev,
            [rollNumber]: !prev[rollNumber]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date) {
            alert('Please enter a date to mark attendance.');
            return;
        }

        const currentAttendanceData = {};
        rollNumbers.forEach(roll => {
            currentAttendanceData[roll] = attendance[roll] ? 'Present' : 'Absent';
            if (attendance[roll]) {
                setPresentCounts((prev) => ({
                    ...prev,
                    [roll]: (prev[roll] || 0) + 1
                }));
            }
        });

        const newAttendanceRecord = { date, attendance: currentAttendanceData };
        const updatedAttendanceRecords = [...attendanceRecords, newAttendanceRecord];
        setAttendanceRecords(updatedAttendanceRecords);

        // Recalculate totalDays as the number of distinct dates for which attendance has been taken.
        setTotalDays(updatedAttendanceRecords.length);

        // Reset attendance for the next day
        setAttendance((prev) => {
            const updatedAttendance = {};
            rollNumbers.forEach(roll => {
                updatedAttendance[roll] = false; // Reset attendance for each roll number
            });
            return updatedAttendance;
        });

        alert('Attendance submitted successfully for ' + date + '!');

        // Save to localStorage
        localStorage.setItem('attendanceRecords', JSON.stringify(updatedAttendanceRecords));
        localStorage.setItem('lastUpdated', new Date().getTime());

        const attendanceData = {
            rollNumbers,
            presentCounts,
            totalDays,
            attendanceRecords: updatedAttendanceRecords
        };

        try {
            const response = await fetch('http://localhost:5000/api/saveAttendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData),
            });

            if (response.ok) {
                alert('Attendance data saved to database successfully!');
            } else {
                alert('Failed to save attendance data.');
            }
        } catch (error) {
            console.error('Error saving attendance data:', error);
            alert('Error saving attendance data.');
        }
    };

    const downloadExcel = () => {
        const excelData = [];
        const headerRow = ['Roll Number', ...attendanceRecords.map(record => record.date), 'Total Present', 'Total Absent', 'Present Percentage'];

        rollNumbers.forEach(roll => {
            const row = [roll];
            attendanceRecords.forEach(record => {
                row.push(record.attendance[roll] || 'Absent');
            });

            const presentCount = presentCounts[roll] || 0;
            const absentCount = totalDays - presentCount;
            const presentPercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) + '%' : '0%';
            row.push(presentCount, absentCount, presentPercentage);
            excelData.push(row);
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...excelData]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        XLSX.writeFile(workbook, 'Attendance_Report.xlsx');
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
        const initialAttendance = {};
        rollNumbers.forEach(roll => {
            initialAttendance[roll] = false;
        });
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
