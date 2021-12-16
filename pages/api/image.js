import dbConnect from '../../db/connect'
import Image from '../../db/models/Image'
import ImageServiceAssociation from '../../db/models/ImageServiceAssociation'
import Service from '../../db/models/Service'
import multer from 'multer'
import nextConnect from 'next-connect'
import path from 'path'
import fs from 'fs'
import requireAuthorization from '../../middleware/requireAuthorization'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
}


const handler = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
})
.use(async (req, res, next) => {
  await dbConnect();
  next()
})
.get( async (req, res) => {
  try {
    const {limit = null, skip = null} = req.query;
    const images = limit && skip
    ? await Image.find().skip(parseInt(skip)).limit(parseInt(limit)).exec()
    : limit ? await Image.find().limit(parseInt(limit)).exec()
    : await Image.find();

    const imgsWithSvcs = await Promise.all(images.map(async dbImg => {
      const associations = await ImageServiceAssociation.find({_image: dbImg._id})
      if(associations.length){
        const services = await Promise.all(associations.map(async assoc => {
          const svc = await Service.findOne({_id: assoc._service})
          return svc.name
        }))
        return Object.assign({}, dbImg._doc, {services})
      }
      return dbImg
    })); 

    res.status(200).json({success: true, images: imgsWithSvcs})
  } catch(err) {
    res.status(400).json({success: false})
  }
})
.post(requireAuthorization(), upload.single('image'), async (req, res) => {
  try {
    const image = req.file;
    const {description, services = null} = req.body; //expect that service is an array of names

    if(!(image || !description || (!image && !description) )){
      throw (!image && 'missing image ') + (!description && 'missing description')
    }
    const url = image.path.replace('public', '');
    const dbImage = await Image.create({url, description})

    if(services) {
      const servicesArr = services.split(',')

      for(let i in servicesArr){
        await ImageServiceAssociation.create({
          _service: servicesArr[i],
          _image: dbImage._id
        })
      }
    }

    res.status(201).json({ success: true, data: dbImage })
  } catch(err) {
    res.status(400).json({ success: false, err })
  }
})
.patch(requireAuthorization(), upload.none(), async (req, res) => {
  try {
    const {imgId, description} = req.body;
    const dbImage = await Image.findOneAndUpdate({_id: imgId}, {description});
    dbImage.description = description;
    await dbImage.save();

    res.status(200).json({success: true, content: dbImage})
  } catch(err) {
    res.status(400).json({ success: false, err })
  }
})
.delete(requireAuthorization(), upload.none(), async (req, res) => {
  try {
    const {imgId} = req.body;

    const imageToDelete = await Image.findOne({_id: imgId});
    const deletedImage = await Image.deleteOne({_id: imgId})

    const isasToDelete = await ImageServiceAssociation.deleteMany({_image: imgId});
    
    fs.unlinkSync(path.join(__dirname, `../../../../public${imageToDelete.url}`));

    res.status(200).json({success: true, deletedImage});
  } catch(err){
    res.status(400).json({success: false})
  }
})

export default handler;