const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  telgram_user_id: { type: String },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
  UserModel,
};
