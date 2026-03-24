const router = require('express').Router();
const Feedback = require('../models/Feedback');
const authMW = require('../middleware/auth');
 
// POST /api/feedback — submit feedback
router.post('/', authMW, async (req, res) => {
  try {
    const { message } = req.body;
 
    if (!message || message.length < 10) {
      return res.status(400).json({
        error: 'Message must be at least 10 characters'
      });
    }
 
    const fb = await Feedback.create({
      userId: req.user._id,
      message
    });
 
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/feedback — admin list all feedback
router.get('/', authMW, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only' });
    }
 
    const list = await Feedback.find()
      .populate('userId', 'first last email')
      .sort('-createdAt');
 
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module. Exports = router;