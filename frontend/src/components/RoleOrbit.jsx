import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleOrbit.css';

const RoleOrbit = () => {
  const navigate = useNavigate();

  const handleCardClick = (role) => {
    if (role === 'admin') {
      navigate('/admin/login');
    } else {
      // Focus email input or stay on login
      const emailInput = document.getElementById('email');
      if (emailInput) {
        emailInput.focus();
      }
    }
  };

  return (
    <div className="role-orbit-viewport">
      <div className="role-orbit-scene">
        
        {/* Central Glowing Blood Drop */}
        <div className="role-orbit-center" title="BloodConnect Core Network">
          <span className="role-orbit-center-icon">🩸</span>
        </div>

        {/* 1. DONOR CARD */}
        <div
          className="role-orbit-card orbit-donor"
          onClick={() => handleCardClick('donor')}
          role="button"
          tabIndex={0}
        >
          <div className="role-card-icon">🩸</div>
          <div className="role-card-title">DONOR</div>
          <div className="role-card-desc">Donate blood and save lives</div>
        </div>

        {/* 2. HOSPITAL CARD */}
        <div
          className="role-orbit-card orbit-hospital"
          onClick={() => handleCardClick('hospital')}
          role="button"
          tabIndex={0}
        >
          <div className="role-card-icon">🏥</div>
          <div className="role-card-title">HOSPITAL</div>
          <div className="role-card-desc">Create blood requests</div>
        </div>

        {/* 3. ADMIN CARD */}
        <div
          className="role-orbit-card orbit-admin"
          onClick={() => handleCardClick('admin')}
          role="button"
          tabIndex={0}
        >
          <div className="role-card-icon">🔐</div>
          <div className="role-card-title">ADMIN</div>
          <div className="role-card-desc">Manage the platform</div>
        </div>

      </div>
    </div>
  );
};

export default RoleOrbit;
