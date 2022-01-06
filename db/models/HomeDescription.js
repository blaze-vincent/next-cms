import mongoose from 'mongoose'

const HomeDescriptionSchema = new mongoose.Schema({
  paragraph: {
    type: String,
    required: true
  }
})

module.exports = mongoose.models.HomeDescription || mongoose.model('HomeDescription', HomeDescriptionSchema)