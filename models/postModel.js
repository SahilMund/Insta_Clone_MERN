const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  loves: [
    {
      type: ObjectId,
      ref: "UserData",
    },],
  likes: [
    {
      type: ObjectId,
      ref: "UserData",
    },
  ],

  comments: [
    {
      text: String,
      postedBy: {
        type: ObjectId,
        ref: "UserData",
      },
    },
  ],

  postedBy: {
    type: ObjectId,
    ref: "UserData",
  },
},{timestamps:true});

mongoose.model("PostData", postSchema);
