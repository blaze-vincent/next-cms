import mongoose from 'mongoose'

const ContactRequest = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.ContactRequest || mongoose.model('ContactRequest', ContactRequest)