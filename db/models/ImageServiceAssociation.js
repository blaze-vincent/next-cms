import mongoose from 'mongoose'

const ImageServiceAssociationSchema = new mongoose.Schema({
  display: {
    type: Boolean,
    default: false,
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