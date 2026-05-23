import React from 'react';
import { ArrowRight, Bot, Code2, LineChart, ChevronRight } from 'lucide-react';

const card = { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' };
const iconBox = { width: '40px', height: '40px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default function Home({ setCurrentTab }) {
  const stats = [
    { value: '98%', label: 'AI Accuracy' },
    { value: '14k+', label: 'Mock Sessions' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '<2 min', label: 'Report Time' },
  ];

  const features = [
    { icon: Bot, title: 'AI Interviewer', desc: 'A conversational AI that asks follow-up questions, evaluates your speaking clarity, and adapts to your experience level in real time.' },
    { icon: Code2, title: 'Coding Sandbox', desc: 'Solve algorithm problems inside a live IDE with AI-guided feedback on time complexity, readability, and edge-case handling.' },
    { icon: LineChart, title: 'Skill Analytics', desc: 'Get a comprehensive breakdown of your performance — behavioral, technical, and communication — after each session.' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: '40px' }}>

      {/* Hero */}
      <div style={{ paddingTop: '20px' }}>
        <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: '600', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>AI-Powered Interview Platform</span>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#fff', lineHeight: '1.25', letterSpacing: '-0.02em', margin: '0 0 16px', maxWidth: '640px' }}>
          Practice interviews that feel real.
        </h1>
        <p style={{ fontSize: '16px', color: '#777', lineHeight: '1.65', maxWidth: '560px', margin: '0 0 28px' }}>
          Simulate real job interview environments, solve coding challenges under live AI guidance, and receive comprehensive feedback dashboards personalized to your resume.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setCurrentTab('setup')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Start Interview <ArrowRight size={15} />
          </button>
          <button onClick={() => setCurrentTab('result')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', background: 'transparent', color: '#888', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
            View Sample Results
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 6px' }}>What's inside</h2>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 20px' }}>Everything you need to simulate a full interview loop.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} style={{ ...card, borderTop: '2px solid #2a2a2a' }}>
              <div style={iconBox}><Icon size={18} color="#888" /></div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#e0e0e0' }}>{title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4ade80', marginTop: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} /> Active
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: '0 0 6px' }}>Ready to test yourself?</h3>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Configure your role and run a complete multi-stage evaluation right now.</p>
        </div>
        <button onClick={() => setCurrentTab('setup')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', flexShrink: 0 }}>
          Get started <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}