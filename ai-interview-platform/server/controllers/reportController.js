
exports.getReport = (req, res) => {
  res.json({
    success: true,
    data: {
      score: 85,
      feedback: 'Excellent architectural understanding and response delivery.'
    }
  });
};
      