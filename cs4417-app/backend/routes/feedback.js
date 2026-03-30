const router = require("express").Router();
const Feedback = require("../models/Feedback");
const authMW = require("../middleware/auth");
const { sanitizePlainText } = require("../utils/sanitize");

// POST /api/feedback — submit feedback
router.post("/", authMW, async (req, res) => {
  try {
    const rawMessage =
      typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!rawMessage || rawMessage.length < 10 || rawMessage.length > 1000) {
      return res.status(400).json({
        error: "Message must be between 10 and 1000 characters",
      });
    }

    const sanitizedMessage = sanitizePlainText(rawMessage);
    console.log("Feedback submit:", {
      userId: String(req.user._id),
      rawMessage,
      sanitizedMessage,
    });

    const fb = await Feedback.create({
      userId: req.user._id,
      message: sanitizedMessage,
    });

    console.log("Feedback saved:", {
      id: String(fb._id),
      storedMessage: fb.message,
    });

    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback — admin list all feedback
router.get("/", authMW, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    const list = await Feedback.find()
      .populate("userId", "first last email")
      .sort("-createdAt");

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
