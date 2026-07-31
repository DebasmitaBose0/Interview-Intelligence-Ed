/**
 * Interview Analytics Exporter Utility
 * Formats, calculates session metrics, and generates downloadable JSON, CSV, and PDF report data payloads.
 */

/**
 * Calculates aggregate performance metrics from interview question responses.
 * @param {Array} questions - List of answered interview questions with scores and evaluation metrics.
 * @returns {Object} Calculated metrics breakdown.
 */
function calculateSessionMetrics(questions = []) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      totalQuestions: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      categoryScores: {},
      completionRate: 0
    };
  }

  let totalScore = 0;
  let highestScore = 0;
  let lowestScore = 100;
  const categoryScores = {};
  const categoryCounts = {};
  let answeredCount = 0;

  questions.forEach((q) => {
    const score = Number(q.score) || 0;
    const category = q.category || q.type || 'General';

    if (q.userResponse || q.answer) {
      answeredCount++;
    }

    totalScore += score;
    if (score > highestScore) highestScore = score;
    if (score < lowestScore) lowestScore = score;

    if (!categoryScores[category]) {
      categoryScores[category] = 0;
      categoryCounts[category] = 0;
    }
    categoryScores[category] += score;
    categoryCounts[category] += 1;
  });

  const categoryAverages = {};
  Object.keys(categoryScores).forEach((cat) => {
    categoryAverages[cat] = Math.round((categoryScores[cat] / categoryCounts[cat]) * 10) / 10;
  });

  return {
    totalQuestions: questions.length,
    answeredQuestions: answeredCount,
    averageScore: Math.round((totalScore / questions.length) * 10) / 10,
    highestScore,
    lowestScore: lowestScore === 100 && questions.length === 0 ? 0 : lowestScore,
    categoryScores: categoryAverages,
    completionRate: Math.round((answeredCount / questions.length) * 100)
  };
}

/**
 * Converts interview evaluation session data into CSV string format.
 * @param {Object} report - Complete interview session report object.
 * @returns {string} CSV formatted content.
 */
function convertReportToCSV(report) {
  if (!report) return '';

  const headers = ['Question Number', 'Category', 'Question Text', 'Score', 'Feedback'];
  const rows = [];

  const questions = report.questions || report.evaluations || [];
  questions.forEach((q, idx) => {
    const questionText = (q.text || q.question || '').replace(/"/g, '""');
    const feedback = (q.feedback || q.evaluation || '').replace(/"/g, '""');
    const category = q.category || 'General';
    const score = q.score || 0;

    rows.push([
      idx + 1,
      `"${category}"`,
      `"${questionText}"`,
      score,
      `"${feedback}"`
    ].join(','));
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Triggers a browser file download from string content or Blob.
 * @param {string} content - Data string content to download.
 * @param {string} filename - Targeted file name.
 * @param {string} mimeType - MIME content type.
 */
function triggerFileDownload(content, filename, mimeType = 'text/plain') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports complete candidate interview report in specified format.
 * @param {Object} reportData - Session evaluation dataset.
 * @param {'json'|'csv'} format - Targeted export format.
 */
function exportReportData(reportData, format = 'json') {
  const metrics = calculateSessionMetrics(reportData.questions || []);
  const exportPayload = {
    exportTimestamp: new Date().toISOString(),
    candidateName: reportData.candidateName || 'Candidate',
    jobRole: reportData.role || 'Software Engineer',
    overallScore: reportData.overallScore || metrics.averageScore,
    metrics,
    questions: reportData.questions || []
  };

  const filePrefix = `interview-report-${(reportData.candidateName || 'candidate').toLowerCase().replace(/\s+/g, '-')}`;

  if (format === 'csv') {
    const csvContent = convertReportToCSV(reportData);
    triggerFileDownload(csvContent, `${filePrefix}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const jsonContent = JSON.stringify(exportPayload, null, 2);
    triggerFileDownload(jsonContent, `${filePrefix}.json`, 'application/json');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateSessionMetrics,
    convertReportToCSV,
    triggerFileDownload,
    exportReportData
  };
}
