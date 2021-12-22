import mongoose from 'mongoose'

//a schema might not be necessary but i want it to be editable without my help
const AboutInfoSchema = new mongoose.Schema({
  paragraph: {
    type: String,
    required: true
  }
})

module.exports = mongoose.models.AboutInfo || mongoose.model('AboutInfo', AboutInfoSchema)