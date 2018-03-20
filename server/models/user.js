const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 15,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  }
});

module.exports = { User };
