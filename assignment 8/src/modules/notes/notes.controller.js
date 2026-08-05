import { Router } from "express";
import { auth } from "../../utils/middleware/auth.middleware.js";
import Note from "../../DB/models/notes.model.js";
import mongoose from "mongoose";

const notesRouter = Router();

notesRouter.post("/add", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const newNote = await Note.create({ ...req.body, userId: userId });

    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.patch("/update/:noteId", auth, async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const note = await Note.findOne({ _id: noteId });

    if (!note) return res.status(404).json({ message: "Note not found" });
    console.log({ user: userId, note: note.userId });

    if (userId != note.userId)
      return res.status(403).json({ message: "You are not the owner" });

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { ...req.body },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.put("/replace/:noteId", auth, async (req, res) => {
  try {
    const { noteId } = req.params;
    const loggedUserId = req.userId;

    const { title, content, userId } = req.body;

    const note = await Note.findOne({ _id: noteId });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (loggedUserId != note.userId)
      return res.status(403).json({ message: "You are not the owner" });

    const updatedNote = await Note.findOneAndReplace(
      { _id: noteId },
      { title, content, userId },
      { returnDocument: "after", runValidators: true },
    );

    res
      .status(200)
      .json({ message: "Note replaced successfully", updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.patch("/all", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const note = await Note.findOne({ userId });

    if (!note) return res.status(404).json({ message: "No note found" });

    await Note.updateMany(
      { userId },
      { title: req.body.title },
      { runValidators: true },
    );

    res.status(200).json({ message: "All notes updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.delete("/delete/:noteId", auth, async (req, res) => {
  try {
    const { noteId } = req.params;
    const loggedUserId = req.userId;

    const note = await Note.findOne({ _id: noteId });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (loggedUserId != note.userId)
      return res.status(403).json({ message: "You are not the owner" });

    const deletedNote = await Note.findOneAndDelete({ _id: noteId });

    res.status(200).json({ message: "Note deleted successfully", deletedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.get("/paginate-sort", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

notesRouter.get("/note-by-content", auth, async (req, res) => {
  try {
    const noteContent = req.query.content;

    const loggedUserId = req.userId;
    const note = await Note.findOne({ content: noteContent });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.get("/note-with-user", auth, async (req, res) => {
  try {
    const loggedUserId = req.userId;

    const notes = await Note.find({ userId: loggedUserId })
      .select({ title: 1, userId: 1, createdAt: 1 })
      .populate({ path: "userId", select: "email-_id" });

    if (notes.length === 0)
      return res.status(404).json({ message: "No notes found" });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.get("/aggregate", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.query;

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
    ];

    if (title) {
      pipeline.push({
        $match: {
          title: {
            $regex: title,
            $options: "i",
          },
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          title: 1,
          userId: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    );

    const notes = await Note.aggregate(pipeline);

    res.status(200).json({
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

notesRouter.delete("/deleteAll", auth, async (req, res) => {
  try {
    const loggedUserId = req.userId;

    const note = await Note.findOne({ userId: loggedUserId });

    if (!note) return res.status(404).json({ message: "Note not found" });

    await Note.deleteMany({ userId: loggedUserId });

    res.status(200).json({ message: "Notes deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

notesRouter.get("/:id", auth, async (req, res) => {
  try {
    const noteId = req.params.id;
    const loggedUserId = req.userId;

    const note = await Note.findOne({ _id: noteId });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (loggedUserId != note.userId)
      return res.status(403).json({ message: "You are not the owner" });

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default notesRouter;
