import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaBars, FaTimes, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import './Professor.css';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

const verticals = ['All Verticals', 'C&D', 'R&C', 'MR', 'Marketing', 'PR', 'CC', 'F&L'];

function Professor() {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('All Verticals');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mark-attendance');

  const filterStudents = useCallback((students, vertical) => {
    let filtered = [];
    if (vertical === 'All Verticals') {
      filtered = students;
    } else {
      filtered = students.filter(student => student.vertical === vertical);
    }
    setFilteredStudents(filtered);
    
    const initialRecords = filtered.map(student => ({
      rollNumber: student.rollNumber.toString(),
      status: 'Present'
    }));
    setAttendanceRecords(initialRecords);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users', {
          params: { 
            role: 'student'
          }
        });
        setAllStudents(response.data);
        filterStudents(response.data, selectedVertical);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate && activeTab === 'mark-attendance') {
      fetchStudents();
    }
  }, [selectedDate, activeTab, filterStudents, selectedVertical]);

  useEffect(() => {
    if (allStudents.length > 0) {
      filterStudents(allStudents, selectedVertical);
    }
  }, [selectedVertical, allStudents, filterStudents]);

  const handleSubmitAttendance = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    if (attendanceRecords.length === 0) {
      setError('No attendance records to submit');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      
      const response = await api.post('/attendance', {
        date: formattedDate,
        records: attendanceRecords.map(record => ({
          rollNumber: record.rollNumber.toString(),
          status: record.status
        }))
      });

      if (response.data.success) {
        alert('Attendance submitted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to submit attendance');
      }
    } catch (err) {
      console.error("Error submitting attendance:", err);
      setError(err.response?.data?.message || err.message || "Failed to submit attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (rollNumber) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.rollNumber === rollNumber 
          ? { 
              ...record, 
              status: record.status === 'Present' ? 'Absent' : 'Present' 
            } 
          : record
      )
    );
  };

  const handleDownload = () => {
    const data = filteredStudents.map(student => {
      const record = attendanceRecords.find(r => r.rollNumber === student.rollNumber);
      return {
        'Roll Number': student.rollNumber,
        'Name': student.name,
        'Vertical': student.vertical,
        'Status': record ? record.status : 'Not Marked'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance_${selectedDate}.xlsx`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <button className={`menu-toggle ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`professor-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h2>Professor Dashboard</h2>
          </div>
          <nav className="dashboard-nav">
            <ul>
              <li
                className={activeTab === 'mark-attendance' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('mark-attendance');
                  setSidebarOpen(false);
                }}
              >
                <FaCalendarAlt className="nav-icon" /> Mark Attendance
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <p>© 2025 Professor Dashboard</p>
          </div>
        </div>

        <main className="main-content">
          <header className="dashboard-header">
            <h1>Attendance Management</h1>
            <div className="header-actions">
              <button 
                onClick={handleSubmitAttendance}
                className="btn btn-primary"
                disabled={!selectedDate || loading}
              >
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </button>
              <button 
                onClick={handleDownload}
                className="btn btn-secondary"
                disabled={!selectedDate || loading}
              >
                <FaDownload /> {window.innerWidth > 768 && 'Download'}
              </button>
            </div>
          </header>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="content-body">
            {loading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
              </div>
            )}

            <div className="filter-controls">
              <div className="filter-group">
                <label>Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <div className="filter-group">
                <label>Select Vertical:</label>
                <select
                  value={selectedVertical}
                  onChange={(e) => setSelectedVertical(e.target.value)}
                >
                  {verticals.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="attendance-grid">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const record = attendanceRecords.find(r => r.rollNumber === student.rollNumber);
                  const isAbsent = record?.status === 'Absent';
                  return (
                    <div key={student.rollNumber} className="attendance-item">
                      <span className="roll-number">{student.rollNumber}</span>
                      <input
                        type="checkbox"
                        checked={isAbsent}
                        onChange={() => handleAttendanceChange(student.rollNumber)}
                        disabled={loading}
                        id={`attendance-${student.rollNumber}`}
                      />
                      <label 
                        htmlFor={`attendance-${student.rollNumber}`} 
                        className={`status-label ${isAbsent ? 'absent' : 'present'}`}
                      >
                        {isAbsent ? 'Absent' : 'Present'}
                      </label>
                    </div>
                  );
                })
              ) : (
                <div className="no-data">
                  {selectedDate ? 'No students found for selected vertical' : 'Please select a date first'}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Professor;