import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: "First Name is required",
    trim: true,
    max: 10,
    match: [
      /^[a-zA-Z]+$/,
      "First Name can only contain letters, NO SPECIAL CHARACTERS NOR NUMBERS!",
    ],
  },
  lastName: {
    type: String,
    required: "Last Name is required",
    trim: true,
    max: 10,
    match: [
      /^[a-zA-Z]+$/,
      "Last Name can only contain letters, NO SPECIAL CHARACTERS NOR NUMBERS!",
    ],
  },
  email: {
    type: String,
    unique: "Email has taken - please enter another email",
    match: [/.+\@.+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(() => {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 8) {
    this.invalidate("password", "Password must be at least 8 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

export default mongoose.model("User", UserSchema);
