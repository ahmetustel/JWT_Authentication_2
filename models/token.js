const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* This is creating a new schema for the post. */
const tokenSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);