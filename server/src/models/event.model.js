import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Event Title is required",
    match: [
      /^[a-zA-Z]+$/,
      "Event title can only contain letters, NO SPECIAL CHARACTERS NOR NUMBERS!",
    ],
    trim: true,
  },
  description: {
    type: String,
    required: "Event Description is required",
    trim: true,
  },
  price: {
    type: String,
    required: "Event Price is required",
  },
  date: {
    type: String,
    required: "Event Date is required",
    trim: true,
  },
  category: {
    type: String,
    required: "Event Category is required",
    trim: true,
  },
  photo: {
    type: String,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Event", EventSchema);
