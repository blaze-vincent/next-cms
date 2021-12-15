import mongoose from 'mongoose'

const ImageServiceAssociationSchema = new mongoose.Schema({
  strength: {
    type: Number,
    default: 99999,
    required: true
  },
  _image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  _service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  }
})

module.exports = mongoose.models.ImageServiceAssociation || mongoose.model('ImageServiceAssociation', ImageServiceAssociationSchema)