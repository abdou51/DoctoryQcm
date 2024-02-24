const Note = require("../models/note");
const mongoose = require("mongoose");
const createNote = async (req, res) => {
  try {
    await Note.deleteMany({
      user: req.user.userId,
      question: req.body.question,
    });

    const newNote = new Note({
      user: req.user.userId,
      ...req.body,
    });

    const createdNote = await newNote.save();

    res.status(201).json(createdNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Note" });
  }
};
const updateNote = async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Note.findById(noteId).populate("user");
    if (note.user.id !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Note.deleteMany({
      user: req.user.userId,
      question: req.body.question,
      _id: {
        $ne: new mongoose.Types.ObjectId(noteId),
      },
    });

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
    });

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating Note" });
  }
};
const getNote = async (req, res) => {
  const userId = req.user.userId;
  const questionId = req.query.question;
  if (!questionId) {
    return res
      .status(400)
      .json({ error: "Missing Question Id in query Params" });
  }
  try {
    const note = await Note.findOne({
      question: questionId,
      user: userId,
    });
    res.status(200).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Note" });
  }
};

module.exports = {
  createNote,
  updateNote,
  getNote,
};
