import { model, Schema, Types } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    jti: {
      type: String,
      required: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

tokenSchema.index("expireIn", { expireAfterSeconds: 0 });

const Token = model("token", tokenSchema);

export default Token;
