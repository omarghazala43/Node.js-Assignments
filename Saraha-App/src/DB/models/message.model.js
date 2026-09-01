import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema({
  content: {
    type: String,
    required: function () {
      return this.attachments.lenght === 0;
    },
  },
  attachments: {
    type: [String],
  },
  senderId: {
    type: Types.ObjectId,
    ref: "User",
  },
  recieverId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  replyTo: {
    type: Types.ObjectId,
    ref: "Message",
  },
});

const Message = model("Message", messageSchema);

export default Message;
