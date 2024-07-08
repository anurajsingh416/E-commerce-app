const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: Date, default: new Date().getTime() },
    role: { type: String, enum:["admin","user"], default:"user"}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;