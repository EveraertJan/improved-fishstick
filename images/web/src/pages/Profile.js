import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TagManager from '../components/TagManager';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profile">
      {/* Toolbar */}
      <div className="toolbar profile-toolbar">
        <div className="toolbar-section">
          <button
            onClick={handleBackToDashboard}
            className="toolbar-btn"
            title="Back to Dashboard"
          >
            ←
          </button>
        </div>
        <div className="toolbar-section">
          <h2 className="toolbar-title">Profile</h2>
        </div>
        <div className="toolbar-section toolbar-actions profile-actions">
          <button
            onClick={handleLogout}
            className="toolbar-btn-secondary"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-field">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.username}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Manage Tags</h2>
          <TagManager showHeader={false} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
