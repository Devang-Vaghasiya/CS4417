const router = require("express").Router();
const User = require("../models/User");
const authMW = require("../middleware/auth");
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admins only" });
  next();
}; // GET /api/users  —  list all users
router.get("/", authMW, adminOnly, async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
}); // POST /api/users  —  create user
router.post("/", authMW, adminOnly, async (req, res) => {
  try {
    const { first, last, email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ error: "Email already in use" });
    const user = await User.create({
      first,
      last,
      email,
      passwordHash: password,
      role,
    });
    res.status(201).json({ id: user._id, first, last, email, role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}); // PUT /api/users/:id  —  edit user
router.put("/:id", authMW, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}); // DELETE /api/users/:id  —  delete user
router.delete("/:id", authMW, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});
module.exports = router;
