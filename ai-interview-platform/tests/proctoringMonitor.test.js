const ProctoringMonitor = require('../client/src/utils/proctoringMonitor');

describe('Candidate Proctoring Monitor Utility', () => {
  test('records violations and triggers callback correctly', () => {
    const onViolationMock = jest.fn();
    const monitor = new ProctoringMonitor({ maxViolations: 3, onViolation: onViolationMock });

    const event1 = monitor.recordViolation('TAB_SWITCH', 'Switched tab');
    expect(event1.type).toBe('TAB_SWITCH');
    expect(onViolationMock).toHaveBeenCalledTimes(1);

    const summary = monitor.getViolationSummary();
    expect(summary.count).toBe(1);
    expect(summary.exceededThreshold).toBe(false);
  });

  test('flags exceededThreshold when count reaches limit', () => {
    const monitor = new ProctoringMonitor({ maxViolations: 2 });
    monitor.recordViolation('WINDOW_BLUR', 'Focus lost 1');
    monitor.recordViolation('WINDOW_BLUR', 'Focus lost 2');

    const summary = monitor.getViolationSummary();
    expect(summary.count).toBe(2);
    expect(summary.exceededThreshold).toBe(true);
    expect(summary.integrityScore).toBe(70);
  });

  test('calculates integrity score deductions accurately', () => {
    const monitor = new ProctoringMonitor();
    expect(monitor.calculateIntegrityScore()).toBe(100);
    monitor.recordViolation('TAB_SWITCH');
    expect(monitor.calculateIntegrityScore()).toBe(85);
  });
});
