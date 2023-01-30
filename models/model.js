const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* This is creating a new schema for the user model. */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hashedpassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);