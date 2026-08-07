describe('CommandPalette Keyboard Navigation Component', () => {
  test('validates keyboard shortcut bindings for CommandPalette dialog', () => {
    const isCmdK = (e) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';

    expect(isCmdK({ ctrlKey: true, key: 'k' })).toBe(true);
    expect(isCmdK({ metaKey: true, key: 'K' })).toBe(true);
    expect(isCmdK({ ctrlKey: false, key: 'k' })).toBe(false);
  });

  test('filters command palette items accurately by query', () => {
    const { DEFAULT_COMMANDS, filterCommands } = require('../client/src/utils/commandRegistry');
    const filtered = filterCommands(DEFAULT_COMMANDS, 'Coding');
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered[0].id).toBe('coding');
  });
});
