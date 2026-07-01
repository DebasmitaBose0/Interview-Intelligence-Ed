import React from 'react';

export default function QuestionInputCard({ value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%',
          background: '#0d0d0d',
          border: '1px solid #222',
          borderRadius: '8px',
          color: '#fff',
          padding: '12px',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          resize: 'vertical',
          transition: 'all 0.15s'
        }}
      />
    </div>
  );
}
