const mongoose = require("mongoose");
const { sanitizePlainText } = require("../utils/sanitize");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
      maxlength: 1000,
      set: sanitizePlainText,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feedback", feedbackSchema);
