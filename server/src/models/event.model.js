import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Event Title is required",
    trim: true,
  },
  description: {
    type: String,
    required: "Event Description is required",
    trim: true,
  },
  price: {
    type: Number,
    required: "Event Price is required"
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
