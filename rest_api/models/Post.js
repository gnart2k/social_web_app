const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  PostUserName: {
    type: String,
    required: true,
  },
  PostUserImage: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    max: 500,
  },
  imgUrl: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },

  comments: {
    type: Array,
    default: [],
  },
  shares: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Post", postSchema);
