import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Common/ToastProvider';

const inp = { width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e0e0e0', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' };

export default function ScheduleInterview({ setCurrentTab }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ role: 'Frontend Engineer', scheduledAt: '', durationMinutes: 45, notes: '' });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { addToast } = useToast();

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('camsense_token');
      const res = await fetch('/api/schedules', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) {
        setSchedules(Array.isArray(json.data) ? json.data : []);
      }
    } catch {
      setError('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchedules(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.scheduledAt) {
      setError('Please select a date and time');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const token = localStorage.getItem('camsense_token');
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        addToast('Interview scheduled successfully!');
        setForm({ role: 'Frontend Engineer', scheduledAt: '', durationMinutes: 45, notes: '' });
        fetchSchedules();
      } else {
        setError(json.message || 'Failed to create schedule');
      }
    } catch {
      setError('Network error, please try again');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const token = localStorage.getItem('camsense_token');
      const res = await fetch(`/api/schedules/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        addToast('Schedule deleted');
        fetchSchedules();
      } else {
        setError(json.message || 'Failed to delete schedule');
      }
    } catch {
      setError('Network error, please try again');
    } finally {
      setDeleting(null);
    }
  };

  const getStatus = (schedule) => {
    const now = Date.now();
    const scheduledAt = new Date(schedule.scheduledAt).getTime();
    const endAt = scheduledAt + (schedule.durationMinutes || 45) * 60 * 1000;
    if (now > endAt) return { label: 'Completed', color: '#555' };
    if (now >= scheduledAt) return { label: 'Active Now', color: '#4ade80' };
    return { label: 'Upcoming', color: '#facc15' };
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} color="#888" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => setCurrentTab('dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <ArrowLeft size={13} /> Back to Dashboard
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Interview Schedule</h1>
        <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Create and manage your mock interview sessions.</p>
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={14} color="#888" /> New Schedule
        </h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={inp}>
            <option>Frontend Engineer</option>
            <option>Backend Engineer</option>
            <option>Fullstack Engineer</option>
            <option>AI / ML Engineer</option>
          </select>
          <input type="datetime-local" value={form.scheduledAt} onChange={e => { setForm(p => ({ ...p, scheduledAt: e.target.value })); setError(''); }} required style={inp} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <input type="number" min="15" max="180" value={form.durationMinutes} onChange={e => setForm(p => ({ ...p, durationMinutes: parseInt(e.target.value) || 45 }))} style={{ ...inp, flex: 1 }} placeholder="Duration (min)" />
          </div>
          <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Preparation notes..." style={{ ...inp, resize: 'none', lineHeight: '1.5' }} />
          {error && <div style={{ color: '#ef4444', fontSize: '12px' }}>{error}</div>}
          <button type="submit" disabled={creating} style={{ padding: '10px 14px', background: creating ? '#1a1a1a' : '#fff', color: creating ? '#555' : '#000', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: creating ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {creating ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Scheduling...</> : <><Plus size={14} /> Schedule Interview</>}
          </button>
        </form>
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} color="#888" /> All Schedules ({schedules.length})
        </h2>
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#555', fontSize: '13px' }}>
            No schedules yet. Create one above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {schedules.map(s => {
              const status = getStatus(s);
              return (
                <div key={s._id} style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{s.role}</span>
                      <span style={{ fontSize: '10px', color: status.color, fontWeight: '500' }}>{status.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#888' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} /> {new Date(s.scheduledAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>{s.durationMinutes || 45} min</span>
                    </div>
                    {s.notes && <span style={{ fontSize: '11px', color: '#666', lineHeight: '1.4' }}>{s.notes}</span>}
                  </div>
                  <button onClick={() => handleDelete(s._id)} disabled={deleting === s._id} style={{ background: 'transparent', border: '1px solid #333', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', padding: '8px', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                    {deleting === s._id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}