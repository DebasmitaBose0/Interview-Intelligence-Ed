import React, { useState, useEffect } from 'react';
import { Bookmark, FileText, Trash2 } from 'lucide-react';
import EmptyState from '../components/Common/EmptyState';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('camsense_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const removeBookmark = (id) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('camsense_bookmarks', JSON.stringify(updated));
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark size={28} /> Saved Questions
        </h1>
        <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.6' }}>
          Review and practice the questions you bookmarked during your interviews.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState 
          icon={FileText} 
          title="No bookmarks yet" 
          description="Questions you bookmark during your interview results will appear here." 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookmarks.map((b, idx) => (
            <div key={b.id || idx} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#fff', background: '#333', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', textTransform: 'capitalize' }}>
                    {b.category || 'General'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {new Date(b.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: '500', lineHeight: '1.5', margin: '0 0 16px' }}>
                  {b.question}
                </h3>
                {b.modelAnswer && (
                  <div style={{ background: '#0d0d0d', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #4ade80' }}>
                    <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 8px', fontWeight: '600' }}>AI Recommended Answer:</p>
                    <p style={{ fontSize: '14px', color: '#e0e0e0', lineHeight: '1.6', margin: 0 }}>
                      {b.modelAnswer}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeBookmark(b.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#555', padding: '8px', borderRadius: '8px', transition: 'all 0.2s' }}
                title="Remove bookmark"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
