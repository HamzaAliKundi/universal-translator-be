import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: BigInt,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    original_text: {
      type: String,
      required: true,
    },
    translated_text: {
      type: String,
    },
    text_hash: {
      type: String,
      required: true,
    },
    audio_url: String,
    image_url: String,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
