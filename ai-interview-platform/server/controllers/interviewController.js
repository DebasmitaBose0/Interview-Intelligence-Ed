exports.startInterview = async (req, res) => {
  res.json({ message: 'Interview session started' });
};

exports.submitAnswer = async (req, res) => {
  res.json({ message: 'Answer submitted successfully' });
};