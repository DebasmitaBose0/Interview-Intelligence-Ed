import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const inp = (err) => ({ width: '100%', background: '#0d0d0d', border: `1px solid ${err ? '#ef4444' : '#2a2a2a'}`, borderRadius: '8px', padding: '10px 12px 10px 38px', fontSize: '14px', color: '#e0e0e0', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.15s' });

export default function Signup({ setToken, setUser, setCurrentTab }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const d = await res.json();
      if (d.success) {
        showToast('Account created!');
        setTimeout(() => { localStorage.setItem('camsense_token', d.data.token); setToken(d.data.token); setUser(d.data); setCurrentTab('home'); }, 1200);
      } else { showToast(d.message || 'Could not create account', 'err'); }
    } catch { showToast('Connection failed. Check server.', 'err'); }
    finally { setTimeout(() => setLoading(false), 1200); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', padding: '0 16px', fontFamily: 'Inter, sans-serif' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100, background: toast.type === 'ok' ? '#14532d' : '#7f1d1d', border: `1px solid ${toast.type === 'ok' ? '#22c55e' : '#ef4444'}`, color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Create account</h2>
        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 24px' }}>Set up your profile to start mock interviews.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#888', display: 'block', marginBottom: '6px' }}>Full name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} color="#555" style={{ position: 'absolute', left: '11px', top: '11px' }} />
              <input type="text" placeholder="Your name" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }} style={inp(errors.name)} />
            </div>
            {errors.name && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{errors.name}</p>}
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#888', display: 'block', marginBottom: '6px' }}>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#555" style={{ position: 'absolute', left: '11px', top: '11px' }} />
              <input type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} style={inp(errors.email)} />
            </div>
            {errors.email && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#888', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#555" style={{ position: 'absolute', left: '11px', top: '11px' }} />
              <input type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} style={{ ...inp(errors.password), paddingRight: '38px' }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '10px', top: '9px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '2px' }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%', padding: '11px', background: loading ? '#1a1a1a' : '#fff', color: loading ? '#555' : '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s' }}>
            {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</> : <>Create account <ArrowRight size={15} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#555', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
          Already have an account?{' '}
          <button onClick={() => setCurrentTab('login')} style={{ background: 'none', border: 'none', color: '#aaa', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
            Sign in
          </button>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
