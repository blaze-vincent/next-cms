import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  secondaryStatus: {
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.models.Service || mongoose.model('Service', ServiceSchema)