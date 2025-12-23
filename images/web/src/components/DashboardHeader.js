import React from 'react';

const DashboardHeader = ({ username, onProfile, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="header-actions">
        <button
          onClick={onProfile}
          className="btn-secondary"
        >
          Profile
        </button>
        <div className="user-info">
          <span>Welcome, {username}!</span>
          <button onClick={onLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
