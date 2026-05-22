exports.register = async (req, res) => {
  res.json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  res.json({ message: 'User logged in successfully' });
};