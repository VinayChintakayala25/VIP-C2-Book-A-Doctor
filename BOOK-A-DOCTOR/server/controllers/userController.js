const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, role, specialization } = req.body;

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
      role: role || "patient", // ✅ allow patient, doctor, admin
      specialization: role === "doctor" ? specialization : undefined,
      status: role === "doctor" ? "pending" : "active", // ✅ doctors start pending, admin/patient active
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        specialization: user.specialization,
        status: user.status,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { registerController, loginController };
