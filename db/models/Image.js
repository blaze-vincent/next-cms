import mongoose from 'mongoose'

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  homeImage: {
    type: Boolean,
    default: false
  },
  aboutImage: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.models.Image || mongoose.model('Image', ImageSchema)