import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

export default model("User", userSchema);
