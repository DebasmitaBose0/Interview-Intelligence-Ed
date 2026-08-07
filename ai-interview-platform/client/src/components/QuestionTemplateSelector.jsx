import React from 'react';
import { Sliders, CheckCircle2 } from 'lucide-react';

const ROLE_PRESETS = [
  { id: 'Frontend Engineer', name: 'Frontend Engineer', focus: 'React, CSS, Performance, DOM' },
  { id: 'Backend Engineer', name: 'Backend Engineer', focus: 'Distributed Systems, SQL, API Security' },
  { id: 'Full Stack Engineer', name: 'Full Stack Engineer', focus: 'End-to-End System Design & State' }
];

export default function QuestionTemplateSelector({ selectedRole, onSelectRole }) {
  return (
    <div style={{ margin: '16px 0', background: '#0d0d0d', border: '1px solid #222', borderRadius: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
        <Sliders size={16} color="#60a5fa" />
        <span>Interview Evaluation Template Presets</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {ROLE_PRESETS.map((preset) => {
          const isSelected = selectedRole === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectRole(preset.id)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${isSelected ? '#3b82f6' : '#222'}`,
                background: isSelected ? 'rgba(59, 130, 246, 0.08)' : '#141414',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: isSelected ? '#60a5fa' : '#e0e0e0' }}>
                  {preset.name}
                </span>
                {isSelected && <CheckCircle2 size={14} color="#60a5fa" />}
              </div>
              <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{preset.focus}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
