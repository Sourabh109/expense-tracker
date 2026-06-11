import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword, deleteAccount } from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [pwdErrors, setPwdErrors] = useState({});

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.name.trim()) errs.name = 'Name is required';
    if (!profile.email) errs.email = 'Email is required';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }
    setProfileLoading(true);
    try {
      const { data } = await updateProfile(profile);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwd.currentPassword) errs.currentPassword = 'Current password required';
    if (!pwd.newPassword || pwd.newPassword.length < 6) errs.newPassword = 'Minimum 6 characters';
    if (pwd.newPassword !== pwd.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwdErrors(errs); return; }
    setPwdLoading(true);
    try {
      await updatePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.')) return;
    try {
      await deleteAccount();
      logout();
      navigate('/login');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 520 }}>
        {/* Avatar */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EBF2FB', color: '#185FA5', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {initials}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>{user?.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user?.email}</p>
          </div>
        </div>

        {/* Update profile */}
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>Account details</h2>
          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className={`form-control${profileErrors.name ? ' error' : ''}`} value={profile.name} onChange={(e) => { setProfile((p) => ({ ...p, name: e.target.value })); setProfileErrors((p) => ({ ...p, name: '' })); }} />
              {profileErrors.name && <p className="form-error">{profileErrors.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className={`form-control${profileErrors.email ? ' error' : ''}`} type="email" value={profile.email} onChange={(e) => { setProfile((p) => ({ ...p, email: e.target.value })); setProfileErrors((p) => ({ ...p, email: '' })); }} />
              {profileErrors.email && <p className="form-error">{profileErrors.email}</p>}
            </div>
            <button className="btn btn-primary" type="submit" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>Change password</h2>
          <form onSubmit={handlePasswordSave}>
            <div className="form-group">
              <label className="form-label">Current password</label>
              <input className={`form-control${pwdErrors.currentPassword ? ' error' : ''}`} type="password" value={pwd.currentPassword} onChange={(e) => { setPwd((p) => ({ ...p, currentPassword: e.target.value })); setPwdErrors((p) => ({ ...p, currentPassword: '' })); }} />
              {pwdErrors.currentPassword && <p className="form-error">{pwdErrors.currentPassword}</p>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">New password</label>
                <input className={`form-control${pwdErrors.newPassword ? ' error' : ''}`} type="password" value={pwd.newPassword} onChange={(e) => { setPwd((p) => ({ ...p, newPassword: e.target.value })); setPwdErrors((p) => ({ ...p, newPassword: '' })); }} />
                {pwdErrors.newPassword && <p className="form-error">{pwdErrors.newPassword}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm new password</label>
                <input className={`form-control${pwdErrors.confirm ? ' error' : ''}`} type="password" value={pwd.confirm} onChange={(e) => { setPwd((p) => ({ ...p, confirm: e.target.value })); setPwdErrors((p) => ({ ...p, confirm: '' })); }} />
                {pwdErrors.confirm && <p className="form-error">{pwdErrors.confirm}</p>}
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={pwdLoading}>
              {pwdLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ borderColor: '#F7C1C1' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#A32D2D' }}>Danger zone</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Permanently delete your account and all of your transactions. This action cannot be undone.
          </p>
          <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>
            Delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
