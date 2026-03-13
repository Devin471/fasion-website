/* ─── Profile Page — Golden Luxury ─────────────────── */
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/users/profile'); setProfile(data); setForm({ name: data.name, email: data.email, phone: data.phone || '' }); }
      catch {}
    })();
  }, []);

  const handleSave = async e => {
    e.preventDefault();
    try { const { data } = await api.put('/users/profile', form); setProfile(data); setEditing(false); setMsg('Profile updated!'); setTimeout(() => setMsg(''), 3000); }
    catch {}
  };

  if (!profile) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="profile-page">
      <h1>My <span className="gold">Profile</span></h1>
      {msg && <div className="profile-success">{msg}</div>}

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">{profile.name?.[0]?.toUpperCase()}</div>
          <h3>{profile.name}</h3>
          <p>{profile.email}</p>
          <p>{profile.phone || 'No phone added'}</p>
          <p className="profile-date">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="profile-details">
          {editing ? (
            <form onSubmit={handleSave}>
              <h3>Edit Profile</h3>
              <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label>Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div className="profile-btns"><button type="submit" className="btn btn-primary">Save Changes</button><button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button></div>
            </form>
          ) : (
            <>
              <h3>Account Details</h3>
              <div className="detail-row"><span>Name</span><span>{profile.name}</span></div>
              <div className="detail-row"><span>Email</span><span>{profile.email}</span></div>
              <div className="detail-row"><span>Phone</span><span>{profile.phone || '—'}</span></div>
              <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>

        <div className="profile-addresses">
          <h3>Saved Addresses</h3>
          {profile.addresses?.length > 0 ? profile.addresses.map((a, i) => (
            <div className="address-card" key={i}>
              <p><strong>{a.fullName}</strong></p>
              <p>{a.street}, {a.city}</p>
              <p>{a.state} — {a.pincode}</p>
              <p>{a.phone}</p>
            </div>
          )) : <p className="no-data">No addresses saved</p>}
        </div>
      </div>
    </div>
  );
}
