import mongoose from 'mongoose'

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  passwordHash: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.Account || mongoose.model('Account', AccountSchema)