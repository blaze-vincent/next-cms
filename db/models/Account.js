import mongoose from 'mongoose'

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.Account || mongoose.model('Account', AccountSchema)