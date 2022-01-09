import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Types.ObjectId,
    ref: "Event",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    trim: true,
    default: "Pending",
  },
});

export default mongoose.model("Registration", RegistrationSchema);
