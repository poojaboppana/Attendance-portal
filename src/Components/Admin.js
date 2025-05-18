import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaUsers, FaCalendarDay, FaChartBar, FaBars, FaTimes, FaDownload, FaTrash, FaSyncAlt } from 'react-icons/fa';
import './Admin.css';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

function Admin() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    rollNumber: '',
    name: '',
    role: 'student',
    vertical: 'C&D'
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [dateFilter, setDateFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (activeTab === 'users') {
          const response = await api.get('/users');
          setUsers(response.data);
        } else if (activeTab === 'daily') {
          const response = await api.get('/attendance/daily', {
            params: { date: dateFilter || new Date().toISOString().split('T')[0] }
          });
          setAttendanceRecords(response.data.data || []);
        } else if (activeTab === 'total') {
          const response = await api.get('/attendance/total');
          setTotalAttendance(response.data.data || []);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} data:`, err);
        setError(err.response?.data?.message || `Failed to load ${activeTab} data. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, dateFilter]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.rollNumber || !newUser.rollNumber.trim()) {
      setError('Roll Number is required');
      return;
    }
    try {
      setLoading(true);
      const response = await api.post('/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({
        rollNumber: '',
        name: '',
        role: 'student',
        vertical: 'C&D'
      });
      setError('');
      alert('User added successfully!');
    } catch (err) {
      console.error("Error adding user:", err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      "Failed to add user";
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (rollNumber) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;

    try {
      setLoading(true);
      await api.delete(`/users/${rollNumber}`);
      setUsers(users.filter(user => user.rollNumber !== rollNumber));
      setError('');
      alert('User removed successfully!');
    } catch (err) {
      console.error("Error removing user:", err);
      setError(err.response?.data?.message || "Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

const handleResetAttendance = async () => {
  if (!window.confirm('Are you sure you want to reset ALL attendance records? This cannot be undone.')) return;

  try {
    setLoading(true);
    const response = await api.post('/attendance/reset', {
      confirm: 'RESET_ALL_ATTENDANCE' // This is optional now
    });
    
    if (activeTab === 'total') {
      const refreshedData = await api.get('/attendance/total');
      setTotalAttendance(refreshedData.data.data || []);
    }
    
    setError('');
    alert(response.data.message || 'Attendance records have been reset successfully');
  } catch (err) {
    console.error("Error resetting attendance:", err);
    setError(err.response?.data?.message || "Failed to reset attendance");
  } finally {
    setLoading(false);
  }
};
  const handleDownload = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserClick = (user, event) => {
    document.body.classList.add('modal-open');
    setSelectedUser({
      ...user,
      clickX: event.clientX,
      clickY: event.clientY,
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshData = () => {
    if (activeTab === 'users') {
      setUsers([]);
      api.get('/users').then(response => setUsers(response.data)).catch(err => setError('Failed to refresh users'));
    } else if (activeTab === 'daily') {
      setAttendanceRecords([]);
      api.get('/attendance/daily', {
        params: { date: dateFilter || new Date().toISOString().split('T')[0] }
      }).then(response => setAttendanceRecords(response.data.data || [])).catch(err => setError('Failed to refresh daily attendance'));
    } else if (activeTab === 'total') {
      setTotalAttendance([]);
      api.get('/attendance/total').then(response => setTotalAttendance(response.data.data || [])).catch(err => setError('Failed to refresh total attendance'));
    }
  };

  return (
    <>
      <button className={`menu-toggle ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h2>Admin Dashboard</h2>
          </div>
          <nav className="dashboard-nav">
            <ul>
              <li
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('users');
                  setSidebarOpen(false);
                }}
              >
                <FaUsers className="nav-icon" /> Manage Users
              </li>
              <li
                className={activeTab === 'daily' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('daily');
                  setSidebarOpen(false);
                }}
              >
                <FaCalendarDay className="nav-icon" /> Daily Attendance
              </li>
              <li
                className={activeTab === 'total' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('total');
                  setSidebarOpen(false);
                }}
              >
                <FaChartBar className="nav-icon" /> Total Attendance
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <p>© 2025 Admin Dashboard</p>
          </div>
        </div>

        <main className="main-content">
          <header className="dashboard-header">
            <h1>
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'daily' && 'Daily Attendance Records'}
              {activeTab === 'total' && 'Total Attendance Summary'}
            </h1>
            <div className="header-actions">
              <button className="refresh-btn" onClick={refreshData}>
                <FaSyncAlt /> Refresh
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

            {activeTab === 'users' && (
              <div className="users-management">
                <div className="user-form">
                  <h3>Add New User</h3>
                  <form onSubmit={handleAddUser}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Roll Number</label>
                        <input
                          type="text"
                          name="rollNumber"
                          placeholder="Enter Roll Number"
                          value={newUser.rollNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter Name"
                          value={newUser.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          name="role"
                          value={newUser.role}
                          onChange={handleInputChange}
                        >
                          <option value="student">Student</option>
                          <option value="professor">Professor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Vertical</label>
                        <select
                          name="vertical"
                          value={newUser.vertical}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="C&D">C&D</option>
                          <option value="R&C">R&C</option>
                          <option value="F&L">F&L</option>
                          <option value="CC">CC</option>
                          <option value="MR">MR</option>
                          <option value="Marketing">Marketing</option>
                          <option value="PR">PR</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Adding...' : 'Add User'}
                    </button>
                  </form>
                </div>

                <div className="users-list">
                  <div className="section-header">
                    <h3>Registered Users</h3>
                    <button 
                      onClick={() => handleDownload(users, 'users_list')}
                      className="btn btn-secondary"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Roll Number</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Vertical</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map(user => (
                            <tr key={user.rollNumber} onClick={(e) => handleUserClick(user, e)}>
                              <td>{user.rollNumber}</td>
                              <td>{user.name}</td>
                              <td>
                                <span className={`role-badge ${user.role}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>{user.vertical}</td>
                              <td>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveUser(user.rollNumber);
                                  }}
                                  className="btn btn-danger"
                                  disabled={loading}
                                >
                                  <FaTrash /> Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'daily' && (
              <div className="daily-attendance">
                <div className="section-header">
                  <h3>Daily Attendance Records</h3>
                  <div className="filter-controls">
                    <div className="filter-group">
                      <label>Filter by Date:</label>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <button 
                      onClick={() => setDateFilter('')}
                      className="btn btn-secondary"
                    >
                      Clear Filter
                    </button>
                    <button 
                      onClick={() => handleDownload(attendanceRecords, 'daily_attendance')}
                      className="btn btn-secondary"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Vertical</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.length > 0 ? (
                        attendanceRecords.map((record, index) => (
                          <tr key={`${record.rollNumber}-${index}`}>
                            <td>{record.rollNumber}</td>
                            <td>{record.name}</td>
                            <td>{record.vertical}</td>
                            <td>
                              <span className={`status-badge ${(record.status || '').toLowerCase()}`}>
                                {record.status || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No records found for the selected date
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'total' && (
              <div className="total-attendance">
                <div className="section-header">
                  <h3>Total Attendance Summary</h3>
                  <div className="filter-controls">
                    <button 
                      onClick={handleResetAttendance} 
                      className="btn btn-danger"
                    >
                      Reset Attendance
                    </button>
                    <button 
                      onClick={() => handleDownload(totalAttendance, 'total_attendance')}
                      className="btn btn-secondary"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Present Days</th>
                        <th>Absent Days</th>
                        <th>Total Days</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalAttendance.length > 0 ? (
                        totalAttendance.map((record, index) => (
                          <tr key={`${record.rollNumber}-${index}`}>
                            <td>{record.rollNumber}</td>
                            <td>{record.name}</td>
                            <td>{record.presentDays}</td>
                            <td>{record.absentDays}</td>
                            <td>{record.totalDays}</td>
                            <td>
                              <div className="progress-container">
                                <div 
                                  className="progress-bar" 
                                  style={{ width: `${record.presentPercentage}%` }}
                                ></div>
                                <span>{record.presentPercentage}%</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No total attendance data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedUser && (
              <div className="user-modal">
                <div
                  className="modal-content"
                  style={{
                    top: `calc(${selectedUser.clickY}px - 20px)`,
                    left: `calc(${selectedUser.clickX}px - 20px)`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className="close-modal"
                    onClick={() => {
                      setSelectedUser(null);
                      document.body.classList.remove('modal-open');
                    }}
                  >
                    ×
                  </span>
                  <div className="modal-details">
                    <h3>{selectedUser.name}</h3>
                    <p><strong>Roll Number:</strong> {selectedUser.rollNumber}</p>
                    <p><strong>Role:</strong> {selectedUser.role}</p>
                    <p><strong>Vertical:</strong> {selectedUser.vertical}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Admin;