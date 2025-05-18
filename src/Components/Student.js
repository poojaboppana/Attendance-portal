import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Student.css';

function Student() {
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  const [loading, setLoading] = useState({
    main: false,
    attendance: false,
    achievements: false
  });
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    department: '',
    year: '',
    profileImage: '',
    vertical: '',
    linkedin: '',
    github: ''
  });
  const [userDetails, setUserDetails] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    image: null,
    type: 'certificate'
  });
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fileInputRef = useRef(null);
  const achievementFileInputRef = useRef(null);
  const navigate = useNavigate();

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIvPjxwYXRoIGQ9Ik0xMiAxMWMtMS4xMDMgMC0yLS44OTctMi0ycy44OTctMiAyLTIgMiAuODk3IDIgMi0uODk3IDItMiAyem0wIDRjLTIuMjA5IDAtNCAxLjE0My00IDIuNWg4YzAtMS4zNTctMS43OTEtMi41LTQtMi41eiIvPjwvc3ZnPg==';

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    instance.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });

    return instance;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/login');
  }, [navigate]);

  const fetchUserData = useCallback(async (regNumber) => {
    try {
      const response = await api.get(`/user/${regNumber}`);
      if (response.data.success) {
        setUserDetails(response.data);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      throw err;
    }
  }, [api]);

  const fetchProfileData = useCallback(async (regNumber) => {
    try {
      const response = await api.get(`/profile/${regNumber}`);
      if (response.data) {
        setProfileData({
          name: response.data.name || '',
          email: response.data.email || '',
          department: response.data.department || '',
          year: response.data.year || '',
          profileImage: response.data.profileImage || '',
          vertical: response.data.vertical || '',
          linkedin: response.data.linkedin || '',
          github: response.data.github || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      throw err;
    }
  }, [api]);

  const fetchAchievements = useCallback(async (regNumber) => {
    try {
      const response = await api.get(`/achievements/${regNumber}`);
      if (response.data.success) {
        setAchievements(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
      throw err;
    }
  }, [api]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const regNumber = localStorage.getItem('regNumber');
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!regNumber || !role || !token) {
          throw new Error('Please login first');
        }

        if (role !== 'student') {
          handleLogout();
          return;
        }

        setLoading(prev => ({ ...prev, main: true }));
        setError(null);

        await fetchUserData(regNumber);
        await fetchProfileData(regNumber);
        await fetchAchievements(regNumber);

        if (activeTab === 'attendance') {
          await handleCheckAttendance();
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          handleLogout();
        }
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(prev => ({ ...prev, main: false }));
      }
    };

    fetchInitialData();
  }, [api, handleLogout, fetchUserData, fetchProfileData, fetchAchievements, activeTab]);

  const handleProfilePhotoChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const regNumber = localStorage.getItem('regNumber');

        setProfileData(prev => ({
          ...prev,
          profileImage: base64Image
        }));

        try {
          await api.post('/profile/save', {
            ...profileData,
            profileImage: base64Image,
            regNumber
          });
        } catch (err) {
          console.error('Failed to save profile picture:', err);
          setProfileData(prev => ({
            ...prev,
            profileImage: prev.profileImage
          }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing image');
      console.error('Image processing error:', err);
    } finally {
      setIsEditingPhoto(false);
    }
  }, [api, profileData]);

  const handleCheckAttendance = useCallback(async () => {
    setLoading(prev => ({ ...prev, attendance: true }));
    setError(null);

    try {
      const regNumber = localStorage.getItem('regNumber');
      if (!regNumber) {
        throw new Error('Please login first');
      }

      const response = await api.get(`/attendance/${regNumber}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'No attendance data received');
      }
      setAttendanceInfo(response.data.data);
    } catch (error) {
      console.error('Attendance fetch error:', error);
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        setError(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  }, [api, handleLogout]);

  useEffect(() => {
    const fetchAttendanceIfNeeded = async () => {
      if (activeTab === 'attendance' && !attendanceInfo) {
        try {
          setLoading(prev => ({ ...prev, attendance: true }));
          setError(null);
          await handleCheckAttendance();
        } catch (err) {
          console.error('Error fetching attendance:', err);
          setError(err.message);
        } finally {
          setLoading(prev => ({ ...prev, attendance: false }));
        }
      }
    };

    fetchAttendanceIfNeeded();
  }, [activeTab, attendanceInfo, handleCheckAttendance]);

  const handleAchievementImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        const compressedImage = canvas.toDataURL('image/jpeg', 0.7);

        setNewAchievement(prev => ({
          ...prev,
          image: compressedImage
        }));
      };
      image.onerror = () => {
        setError('Failed to process image');
      };
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.image) {
      setError('Title and image proof are required');
      return;
    }

    if (newAchievement.image.length > 5 * 1024 * 1024) {
      setError('Image size is too large (max 5MB)');
      return;
    }

    try {
      const regNumber = localStorage.getItem('regNumber');
      const response = await api.post('/achievements', {
        regNumber,
        type: newAchievement.type,
        title: newAchievement.title,
        description: newAchievement.description,
        image: newAchievement.image,
      });

      if (response.data.success) {
        setAchievements([response.data.data, ...achievements]);
        setNewAchievement({
          title: '',
          description: '',
          image: null,
          type: 'certificate'
        });
        if (achievementFileInputRef.current) {
          achievementFileInputRef.current.value = null;
        }
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to add E-Cell achievement');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add E-Cell achievement');
    }
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setNewAchievement({
      title: achievement.title,
      image: achievement.image,
      type: achievement.type
    });
  };

  const handleUpdateAchievement = async () => {
    if (!editingAchievement || !newAchievement.title || !newAchievement.image) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await api.put(
        `/achievements/${editingAchievement._id}`,
        {
          type: newAchievement.type,
          title: newAchievement.title,
          image: newAchievement.image,
        }
      );

      if (response.data.success) {
        setAchievements(achievements.map(ach =>
          ach._id === editingAchievement._id ? response.data.data : ach
        ));
        setEditingAchievement(null);
        setNewAchievement({ title: '', image: null, type: 'certificate' });
        if (achievementFileInputRef.current) {
          achievementFileInputRef.current.value = null;
        }
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to update achievement');
      }
    } catch (err) {
      console.error('Error updating achievement:', err);
      setError(err.response?.data?.message || 'Failed to update achievement');
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const response = await api.delete(`/achievements/${id}`);
      if (response.data.success) {
        setAchievements(achievements.filter(ach => ach._id !== id));
        if (selectedAchievement && selectedAchievement._id === id) {
          setSelectedAchievement(null);
        }
        if (editingAchievement && editingAchievement._id === id) {
          setEditingAchievement(null);
          setNewAchievement({ title: '', image: null, type: 'certificate' });
        }
      } else {
        throw new Error(response.data.message || 'Failed to delete achievement');
      }
    } catch (err) {
      console.error('Error deleting achievement:', err);
      setError(err.response?.data?.message || 'Failed to delete achievement');
    }
  };

  const cancelEdit = () => {
    setEditingAchievement(null);
    setNewAchievement({ title: '', image: null, type: 'certificate' });
    if (achievementFileInputRef.current) {
      achievementFileInputRef.current.value = null;
    }
    setError(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderAchievementsTab = () => {
    return (
      <div className="achievements-tab">
        <div className="add-achievement-form">
          <h2>Add E-Cell Achievement</h2>

          <div className="form-group">
            <label>Achievement Type:</label>
            <select
              value={newAchievement.type}
              onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value })}
            >
              <option value="certificate">E-Cell Certificate</option>
              <option value="competition">E-Cell Competition</option>
              <option value="workshop">E-Cell Workshop</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              placeholder="E-Cell achievement title"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Description (Optional):</label>
            <textarea
              placeholder="Brief description of your E-Cell achievement"
              value={newAchievement.description}
              onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label>Proof Image:</label>
            <input
              type="file"
              accept="image/*"
              ref={achievementFileInputRef}
              onChange={handleAchievementImageChange}
            />
            <small>Upload image proof of your E-Cell achievement</small>
          </div>

          {newAchievement.image && (
            <div className="image-preview-container">
              <img src={newAchievement.image} alt="Preview" className="image-preview" />
              <button
                className="clear-image"
                onClick={() => {
                  setNewAchievement({ ...newAchievement, image: null });
                  if (achievementFileInputRef.current) {
                    achievementFileInputRef.current.value = null;
                  }
                }}
              >
                ×
              </button>
            </div>
          )}

          <div className="form-actions">
            {editingAchievement ? (
              <>
                <button
                  className="update-button"
                  onClick={handleUpdateAchievement}
                  disabled={!newAchievement.title || !newAchievement.image}
                >
                  Update Achievement
                </button>
                <button className="cancel-button" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="add-button"
                onClick={handleAddAchievement}
                disabled={!newAchievement.title || !newAchievement.image}
              >
                Add Achievement
              </button>
            )}
          </div>
        </div>

        <div className="achievements-section">
          <h2>Your Achievements</h2>
          {achievements.length > 0 ? (
            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <div key={achievement._id} className="achievement-card">
                  <div className="achievement-badge">
                    {achievement.type === 'certificate' && <i className="fas fa-certificate"></i>}
                    {achievement.type === 'competition' && <i className="fas fa-trophy"></i>}
                    {achievement.type === 'workshop' && <i className="fas fa-chalkboard-teacher"></i>}
                  </div>

                  <div className="achievement-content">
                    <h3>{achievement.title}</h3>
                    <small className="achievement-type">E-Cell {achievement.type}</small>

                    {achievement.description && (
                      <p className="achievement-description">{achievement.description}</p>
                    )}

                    <div className="achievement-date">
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>

                    {achievement.verified && (
                      <div className="verified-badge">
                        <i className="fas fa-check-circle"></i> Verified
                      </div>
                    )}
                  </div>

                  <div
                    className="achievement-image-container"
                    onClick={() => setSelectedAchievement(achievement)}
                  >
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="achievement-image"
                    />
                  </div>

                  <div className="achievement-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditAchievement(achievement)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAchievement(achievement._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-achievements">No achievements added yet.</p>
          )}
        </div>

        {selectedAchievement && (
          <div className="achievement-modal">
            <div className="modal-content">
              <span
                className="close-modal"
                onClick={() => setSelectedAchievement(null)}
              >
                ×
              </span>
              <div className="modal-image-container">
                <img
                  src={selectedAchievement.image}
                  alt={selectedAchievement.title}
                  className="modal-image"
                />
              </div>
              <div className="modal-details">
                <h3>{selectedAchievement.title}</h3>
                <p><strong>Type:</strong> {selectedAchievement.type}</p>
                {selectedAchievement.description && (
                  <p><strong>Description:</strong> {selectedAchievement.description}</p>
                )}
                <p><strong>Date:</strong> {new Date(selectedAchievement.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAttendanceTab = () => {
    const regNumber = localStorage.getItem('regNumber');

    return (
      <div className="attendance-tab">
        <h2>Your Attendance</h2>
        <div className="attendance-card">
          <div className="attendance-header">
            <h3>Registration Number: {regNumber}</h3>
            {userDetails?.name && <p>Name: {userDetails.name}</p>}
            {userDetails?.vertical && <p>Vertical: {userDetails.vertical}</p>}
          </div>

          {loading.attendance ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">
              <p style={{ color: 'red' }}>{error}</p>
            <button onClick={handleCheckAttendance}>Retry</button>
            </div>
          ) : attendanceInfo ? (
            <div className="attendance-details">
              <div className="attendance-metric">
                <span className="metric-label">Total Meetings:</span>
                <span className="metric-value">{attendanceInfo.totalDays}</span>
              </div>
              <div className="attendance-metric">
                <span className="metric-label">Attended:</span>
                <span className="metric-value present">{attendanceInfo.presentDays}</span>
              </div>
              <div className="attendance-metric">
                <span className="metric-label">Not Attended:</span>
                <span className="metric-value absent">{attendanceInfo.absentDays}</span>
              </div>
              <div className="attendance-metric percentage">
                <span className="metric-label">Attendance Percentage:</span>
                <span className="metric-value" style={{
                  color: parseFloat(attendanceInfo.presentPercentage) >= 75 ? 'green' :
                    (parseFloat(attendanceInfo.presentPercentage) >= 50 ? 'orange' : 'red')
                }}>
                  {attendanceInfo.presentPercentage}
                </span>
              </div>
            </div>
          ) : (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <button className={`menu-toggle ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className="dashboard-container">
        <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
          <div className="profile-section">
            <div className="avatar">
              <img
                src={profileData?.profileImage || fallbackImage}
                alt="Profile"
                style={{ cursor: 'pointer' }}
                onError={(e) => {
                  if (e.target.src !== fallbackImage) {
                    e.target.src = fallbackImage;
                  } else {
                    e.target.onerror = null;
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <div className="change-photo-text" onClick={() => fileInputRef.current?.click()}>
                Change Photo
              </div>
            </div>
            <h2>{profileData.name || userDetails?.regNumber || 'User'}</h2>
            <p className="username">@{userDetails?.regNumber || 'username'}</p>

            <div className="social-links">
              {profileData.linkedin && (
                <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
              )}
              {profileData.github && (
                <a href={profileData.github} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
              )}
            </div>
            <Link to="/profile" className="edit-profile-btn">
              <button>Edit Profile</button>
            </Link>
          </div>
          <nav className="dashboard-nav">
            <ul>
              <li
                className={activeTab === 'attendance' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('attendance');
                  setSidebarOpen(false);
                }}
              >
                <i className="fas fa-clipboard-check"></i> Attendance
              </li>
              <li
                className={activeTab === 'achievements' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('achievements');
                  setSidebarOpen(false);
                }}
              >
                <i className="fas fa-certificate"></i> Achievements
              </li>
              <li className="logout-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <p>Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="main-content">
          <header className="dashboard-header">
            <h1>{activeTab === 'attendance' ? 'Attendance' : 'Achievements'}</h1>
            <div className="header-actions">
              <button className="refresh-btn" onClick={() => window.location.reload()}>
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </header>

          {activeTab === 'attendance' && renderAttendanceTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
        </div>
      </div>
    </>
  );
}

export default Student;
