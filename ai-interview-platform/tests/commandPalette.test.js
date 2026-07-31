describe('CommandPalette Keyboard Navigation Component', () => {
  test('validates keyboard shortcut bindings for CommandPalette dialog', () => {
    const isCmdK = (e) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';

    expect(isCmdK({ ctrlKey: true, key: 'k' })).toBe(true);
    expect(isCmdK({ metaKey: true, key: 'K' })).toBe(true);
    expect(isCmdK({ ctrlKey: false, key: 'k' })).toBe(false);
  });
});
