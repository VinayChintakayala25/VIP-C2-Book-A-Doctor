const express = require("express");
const {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
  changePasswordController,
  uploadProfilePictureController,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ destructure correctly

const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Get Profile
router.get("/profile", authMiddleware, getProfileController);

// Update Profile
router.put("/profile", authMiddleware, updateProfileController);

// Change Password
router.put("/change-password", authMiddleware, changePasswordController);

// Upload Profile Picture
router.put("/profile-picture", authMiddleware, uploadProfilePictureController);

module.exports = router;
