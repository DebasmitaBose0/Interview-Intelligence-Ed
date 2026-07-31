const { calculateSessionMetrics, convertReportToCSV } = require('../client/src/utils/analyticsExporter');

describe('Interview Analytics Exporter Utility', () => {
  const sampleQuestions = [
    { text: 'Explain Closures in JavaScript', category: 'Technical', score: 85, userResponse: 'A closure is...' },
    { text: 'Describe a time you solved a conflict', category: 'Behavioral', score: 90, userResponse: 'I communicated...' },
    { text: 'What is Time Complexity of QuickSort?', category: 'Technical', score: 75, userResponse: 'O(n log n)...' }
  ];

  test('calculateSessionMetrics accurately summarizes question scores and categories', () => {
    const metrics = calculateSessionMetrics(sampleQuestions);

    expect(metrics.totalQuestions).toBe(3);
    expect(metrics.answeredQuestions).toBe(3);
    expect(metrics.averageScore).toBe(83.3);
    expect(metrics.highestScore).toBe(90);
    expect(metrics.lowestScore).toBe(75);
    expect(metrics.categoryScores['Technical']).toBe(80);
    expect(metrics.categoryScores['Behavioral']).toBe(90);
    expect(metrics.completionRate).toBe(100);
  });

  test('calculateSessionMetrics handles empty or null input gracefully', () => {
    const metrics = calculateSessionMetrics([]);
    expect(metrics.totalQuestions).toBe(0);
    expect(metrics.averageScore).toBe(0);
    expect(metrics.completionRate).toBe(0);
  });

  test('convertReportToCSV formats interview questions into proper CSV rows', () => {
    const report = { questions: sampleQuestions };
    const csv = convertReportToCSV(report);

    expect(csv).toContain('Question Number,Category,Question Text,Score,Feedback');
    expect(csv).toContain('1,"Technical","Explain Closures in JavaScript",85');
    expect(csv).toContain('2,"Behavioral","Describe a time you solved a conflict",90');
  });
});
