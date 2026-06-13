const express = require("express");
const {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
  changePasswordController,
  uploadProfilePictureController,
  uploadReportController,
} = require("../controllers/userController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/profile", authMiddleware, getProfileController);
router.put("/profile", authMiddleware, updateProfileController);

router.put("/change-password", authMiddleware, changePasswordController);

router.put(
  "/profile-picture",
  authMiddleware,
  uploadProfilePictureController
);

router.post(
  "/reports/upload",
  authMiddleware,
  uploadReportController
);

module.exports = router;