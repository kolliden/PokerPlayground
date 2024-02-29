const User = require('../models/User');

const getUserById = async (req, res) => {
  try {
    // Get the user from the session
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}
const updateUser = async (req, res) => {
  try {
    // Get the user from the session
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hash(password, 10);
    User.findByIdAndUpdate(user._id, { username, password: hashedPassword }, (err, user) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.status(200).json(user);
    }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}

const deleteUser = async (req, res) => {
  try {
    // Get the user from the session
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    User.findByIdAndDelete(user._id, (err, user) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.status(200).json(user);
    }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}

module.exports = {
  getUserById,
  updateUser,
  deleteUser
}
