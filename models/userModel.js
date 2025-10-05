const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
      min: 5,
    },
  },
  { timestamps: true }
)

const userModel = mongoose.model('users', userSchema)

module.exports = userModel
