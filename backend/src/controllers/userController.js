import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will expire in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad request
    throw new Error('User already exists');
  }

  // 2. Create new user in the database
  const user = await User.create({
    name,
    email,
    password, // The password will be automatically hashed by our userModel
  });

  // 3. If user was created successfully, send back user data and a token
  if (user) {
    res.status(201).json({ // 201 = Something was successfully created
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists and if passwords match
  if (user && (await user.matchPassword(password))) {
    // 3. If they match, send back user data and a new token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    // 4. If they don't match, send an error
    res.status(401); // 401 Unauthorized
    throw new Error('Invalid email or password');
  }
});


// Export both functions
export { registerUser, loginUser };


