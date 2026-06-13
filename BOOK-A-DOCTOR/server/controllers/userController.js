const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
      status: role === "doctor" ? "pending" : "active",
    });

    await user.save();

    res.status(201).json({
      message:
        user.role === "doctor"
          ? "Doctor registered successfully. Waiting for admin approval."
          : "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    if (user.role === "doctor" && user.status !== "approved") {
      return res.status(403).json({ message: "Doctor account is not approved yet" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      status: user.status,
      user,
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateProfileController = async (req, res) => {
  try {
    delete req.body.password;
    delete req.body.role;
    delete req.body.status;

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password" });
  }
};

const uploadProfilePictureController = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile picture updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile picture" });
  }
};

const uploadReportController = async (req, res) => {
  try {
    const { fileName, fileUrl } = req.body;

    const user = await User.findById(req.user.id);
    user.reports.push({ fileName, fileUrl });
    await user.save();

    res.json({ message: "Report uploaded successfully", reports: user.reports });
  } catch (err) {
    res.status(500).json({ message: "Error uploading report" });
  }
};

module.exports = {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
  changePasswordController,
  uploadProfilePictureController,
  uploadReportController,
};