import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import axios from 'axios';

const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIvPjxwYXRoIGQ9Ik0xMiAxMWMtMS4xMDMgMC0yLS44OTctMi0ycy44OTctMiAyLTIgMiAuODk3IDIgMi0uODk3IDItMiAyem0wIDRjLTIuMjA5IDAtNCAxLjE0My00IDIuNWg4YzAtMS4zNTctMS43OTEtMi41LTQtMi41eiIvPjwvc3ZnPg==';

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    regNumber: '',
    name: '',
    email: '',
    department: '',
    year: '',
    vertical: '',
    linkedin: '',
    github: '',
    profileImage: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const regNumber = localStorage.getItem('regNumber');
        if (!regNumber) throw new Error('Registration number not found');

        const response = await axios.get(`http://localhost:5000/api/profile/${regNumber}`, {
          headers: { 'Cache-Control': 'no-cache' }
        });

        setProfile({
          regNumber: response.data.regNumber || regNumber,
          name: response.data.name || '',
          email: response.data.email || '',
          department: response.data.department || '',
          year: response.data.year || '',
          vertical: response.data.vertical || '',
          linkedin: response.data.linkedin || '',
          github: response.data.github || '',
          profileImage: response.data.profileImage || ''
        });
      } catch (err) {
        console.error("Profile load error:", err);
        if (err.response?.status === 404) {
          setProfile(prev => ({ ...prev, regNumber: localStorage.getItem('regNumber') || '' }));
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profileImage') {
      if (!files?.[0]) return;
      
      const reader = new FileReader();
      reader.onload = () => setProfile(prev => ({ ...prev, profileImage: reader.result }));
      reader.onerror = () => setError('Error reading image file');
      reader.readAsDataURL(files[0]);
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const regNumber = profile.regNumber || localStorage.getItem('regNumber');
      if (!regNumber) throw new Error('Registration number is required');

      const response = await axios.post(
        "http://localhost:5000/api/profile/save", 
        profile,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setProfile(response.data.profile);
      navigate('/studentdashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save profile');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="floating-cubes-bg">
        {[...Array(12)].map((_, i) => <div key={i} className="floating-cube"></div>)}
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <h2 className="profile-title">Profile Settings</h2>
          {error && <div className="error-message">{error}</div>}
          
          <div className="profile-pic-wrapper">
            <img
              src={profile.profileImage || fallbackImage}
              alt="Profile"
              className="profile-pic"
              onError={(e) => (e.target.src = fallbackImage)}
            />
          </div>
          
          <form onSubmit={handleSubmit}>
            <input 
              className="input" 
              name="regNumber" 
              value={profile.regNumber} 
              onChange={handleChange}
              disabled
              required
            />
            <input 
              className="input" 
              name="name" 
              value={profile.name} 
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input 
              className="input" 
              name="email" 
              type="email"
              value={profile.email} 
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input 
              className="input" 
              name="department" 
              value={profile.department} 
              onChange={handleChange}
              placeholder="Department"
            />
            <input 
              className="input" 
              name="year" 
              value={profile.year} 
              onChange={handleChange}
              placeholder="Year"
            />
            <input 
              className="input" 
              name="vertical" 
              value={profile.vertical} 
              onChange={handleChange}
              placeholder="Vertical"
            />
            <input 
              className="input" 
              name="linkedin" 
              value={profile.linkedin} 
              onChange={handleChange}
              placeholder="LinkedIn URL"
            />
            <input 
              className="input" 
              name="github" 
              value={profile.github} 
              onChange={handleChange}
              placeholder="GitHub URL"
            />
            
            <div className="file-input-wrapper">
              <label className="file-input-label">
                Change Profile Picture
                <input 
                  type="file" 
                  name="profileImage" 
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>
            </div>
            
            <div className="button-group">
              <button type="submit" className="button" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Update Profile'}
              </button>
              <button 
                type="button" 
                className="button-outline"
                onClick={() => navigate('/studentdashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;