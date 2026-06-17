const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User / Doctor / Admin
const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      specialization,
      hospital,
      experience,
      consultationFees,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "patient",

      specialization: role === "doctor" ? specialization : undefined,
      hospital: role === "doctor" ? hospital : undefined,
      experience: role === "doctor" ? experience : undefined,
      consultationFees: role === "doctor" ? consultationFees : undefined,

      status: role === "doctor" ? "pending" : "active",
    });

    await user.save();

    res.status(201).json({
      message:
        role === "doctor"
          ? "Doctor registered successfully. Waiting for admin approval."
          : "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // For college project testing, doctors can login even before approval.
    // Patient dashboard will only show approved doctors.
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userWithoutPassword = await User.findById(user._id).select("-password");

    res.json({
      token,
      role: user.role,
      status: user.status,
      user: userWithoutPassword,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

// Get logged-in user profile
const getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({
      message: "Error fetching profile",
      error: err.message,
    });
  }
};

// Update profile
const updateProfileController = async (req, res) => {
  try {
    delete req.body.password;
    delete req.body.role;
    delete req.body.status;

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({
      message: "Error updating profile",
      error: err.message,
    });
  }
};

// Change password
const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({
      message: "Error changing password",
      error: err.message,
    });
  }
};

// Profile picture update using image URL
const uploadProfilePictureController = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({
        message: "Profile picture URL is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile picture updated successfully",
      user,
    });
  } catch (err) {
    console.error("Profile picture update error:", err);
    res.status(500).json({
      message: "Error updating profile picture",
      error: err.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
  changePasswordController,
  uploadProfilePictureController,
};