const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMW = require("../middleware/auth");
const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { first, last, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ error: "Email already in use" });
    const user = await User.create({
      first,
      last,
      email,
      passwordHash: password,
      role: "customer",
    });
    res
      .status(201)
      .json({
        token: sign(user._id),
        user: { id: user._id, first, last, email, role: user.role },
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.verifyPassword(password)))
      return res.status(401).json({ error: "Invalid credentials" });
    res.json({
      token: sign(user._id),
      user: {
        id: user._id,
        first: user.first,
        last: user.last,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/auth/change-password  (authenticated)
router.put("/change-password", authMW, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.verifyPassword(currentPassword)))
      return res.status(401).json({ error: "Current password incorrect" });
    user.passwordHash = newPassword;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/auth/profile  (authenticated)
router.put("/profile", authMW, async (req, res) => {
  try {
    const { first, last, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { first, last, email },
      { new: true, runValidators: true },
    ).select("-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
