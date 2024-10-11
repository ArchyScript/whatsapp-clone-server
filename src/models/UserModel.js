const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
},)

UserSchema.pre('save', async function (next) {
  const salt = await bcryptjs.genSalt()
  this.password = await bcryptjs.hash(this.password, salt)
  next()
})

module.exports = mongoose.model('Users', UserSchema)
