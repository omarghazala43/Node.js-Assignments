import mongoose, { Schema, Types } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: "Title cant be uppercase",
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("note", noteSchema);

export default Note;
