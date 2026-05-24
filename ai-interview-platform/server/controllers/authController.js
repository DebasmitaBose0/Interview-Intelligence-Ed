// @desc    Get current user details statelessly
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Return the user mapped statelessly from the decoded Firebase token in authMiddleware
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get Me Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user (Stateless wrapper)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};