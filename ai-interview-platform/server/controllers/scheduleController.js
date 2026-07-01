
exports.getSchedule = (req, res) => {
  res.json({
    success: true,
    scheduledAt: new Date(Date.now() + 300000).toISOString() // 5 mins from now
  });
};
