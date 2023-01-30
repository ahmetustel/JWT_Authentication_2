const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* This is creating a new schema for the post. */
const postSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);