const AuthService = require('../services/authService');

// Example of handling authentication-related operations
async function login(req, res, next) {
  try {
    const token = await AuthService.login(req.body);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
}

// Other authentication-related controller functions (register, logout, resetPassword, etc.)

module.exports = {
  login,
  // Other exported authentication-related functions
};
