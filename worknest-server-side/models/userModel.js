const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      maxlength: 50,
    },
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    companyName: {
      type: String,
      required: true,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      maxlength: 50,
    },
    role: {
      type: String,
      required: true,
      maxlength: 30,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const UserModel = model("user", UserSchema);

module.exports = UserModel;
