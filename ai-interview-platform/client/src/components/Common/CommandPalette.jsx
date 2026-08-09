import React, { useState, useEffect } from 'react';
import { Search, Compass, Code, LayoutDashboard, Settings, FileText, Sun, Moon } from 'lucide-react';
import './CommandPalette.css';

export default function CommandPalette({ isOpen, onClose, onSelectTab }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, tab: 'dashboard' },
    { id: 'setup', label: 'Launch New Interview Setup', icon: Compass, tab: 'setup' },
    { id: 'interview', label: 'Go to Interview Session', icon: Settings, tab: 'interview' },
    { id: 'coding', label: 'Go to Coding Assessment', icon: Code, tab: 'coding' },
    { id: 'result', label: 'View Assessment Results', icon: FileText, tab: 'result' }
  ];

  const { DEFAULT_COMMANDS, filterCommands } = require('../../utils/commandRegistry');

  const filteredCommands = filterCommands(DEFAULT_COMMANDS, query);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelectTab(filteredCommands[selectedIndex].tab);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onSelectTab, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cmd-palette-overlay" onClick={onClose}>
      <div className="cmd-palette-box" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-label="Command palette input"
          className="cmd-palette-input"
          placeholder="Type a command or navigate pages... (Press ESC to exit)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="cmd-palette-list">
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '16px', color: '#888', fontSize: '13px', textAlign: 'center' }}>
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  className={`cmd-palette-item ${idx === selectedIndex ? 'active' : ''}`}
                  onClick={() => {
                    onSelectTab(cmd.tab);
                    onClose();
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} />
                    <span>{cmd.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#666' }}>Jump to page</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
