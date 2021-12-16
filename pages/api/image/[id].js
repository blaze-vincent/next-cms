import dbConnect from '../../../db/connect'
import Image from '../../../db/models/Image'
import multer from 'multer'

export const config = {
    api: {
      bodyParser: false,
    },
  }