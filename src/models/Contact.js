const mongoose = require('mongoose')
const Schema = mongoose.Schema

//
const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
    match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'],
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Contact', ContactSchema)
