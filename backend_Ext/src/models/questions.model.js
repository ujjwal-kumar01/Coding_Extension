import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  notes: { type: String },
  topics: { type: [String], default: [] },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true, // Optional: to sort by createdAt in your controller
});

export const Question = mongoose.model("Question", questionSchema);
