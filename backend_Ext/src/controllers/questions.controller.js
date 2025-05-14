import mongoose from "mongoose";
import { Question } from "../models/questions.model.js";

// GET /question-ext/v1/get
export const getQuestions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const userId = req.user._id;
    const questions = await Question.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    console.error('Error in getQuestions:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Server error while fetching questions' });
  }
};

// POST /question-ext/v1/add
export const addQuestion = async (req, res) => {
  try {
    const { title, url, notes, topics } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const existing = await Question.findOne({ url, user: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "Question already marked" });
    }

    await Question.create({
      title,
      url,
      notes,
      topics,
      user: req.user._id,
    });

    return res.status(201).json({ message: "Question added" });
  } catch (error) {
    console.error("Error adding question:", error);
    return res.status(500).json({ message: "Server Issue!" });
  }
};

// PUT /question-ext/v1/edit/:id
export const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, notes, topics } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const question = await Question.findOne({ _id: id, user: req.user._id });
    if (!question) {
      return res.status(404).json({ message: 'Question not found or unauthorized' });
    }

    question.title = title || question.title;
    question.url = url || question.url;
    question.notes = notes || question.notes;
    question.topics = topics || question.topics;

    await question.save();

    return res.status(200).json({ message: "Question updated successfully" });
  } catch (error) {
    console.error("Error editing question:", error);
    return res.status(500).json({ message: "Server error while updating question" });
  }
};

// DELETE /question-ext/v1/delete/:id
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const deleted = await Question.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "Question not found or unauthorized" });
    }

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: "Server error while deleting question" });
  }
};
