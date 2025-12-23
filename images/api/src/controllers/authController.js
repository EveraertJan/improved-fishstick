const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { checkBodyFields } = require('../helpers/bodyHelpers');

const SALT_ROUNDS = 10;

// POST /api/auth/register
const register = async (req, res) => {
  try {
    if (!checkBodyFields(req.body, ['username', 'email', 'password'])) {
      return res.status(400).json({
        message: 'Missing required fields: username, email, password'
      });
    }

    const { username, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength (min 8 chars)
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await db('users')
      .where({ email })
      .orWhere({ username })
      .first();

    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const [user] = await db('users')
      .insert({
        username,
        email,
        password_hash
      })
      .returning(['id', 'username', 'email', 'created_at']);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    if (!checkBodyFields(req.body, ['email', 'password'])) {
      return res.status(400).json({
        message: 'Missing required fields: email, password'
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await db('users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// GET /api/auth/me (verify token and get current user)
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by decodeToken middleware
    const user = await db('users')
      .where({ id: req.user.userId })
      .select('id', 'username', 'email', 'created_at')
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
