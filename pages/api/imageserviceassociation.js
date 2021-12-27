import multer from "multer";
import nextConnect from "next-connect";
import dbConnect from "../../db/connect";
import ImageServiceAssociation from '../../db/models/ImageServiceAssociation'
import Service from '../../db/models/Service'
import requireAuthorization from "../../middleware/requireAuthorization";

const upload = multer();

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
  next();
})
.get(async (req, res) => {
  try {
    let isassociation;

    const {service = null, display = false} = req.query
    if(service){
      if(display){
        isassociation = await ImageServiceAssociation.findOne({_service: service, display: true})
      } else {
        isassociation = await ImageServiceAssociation.find({_service: service})
      }
    } else {
      isassociation = await ImageServiceAssociation.find({})
    }
    res.status(200).json({success: true, isassociation})
  } catch(err) {
    res.status(400).json({success: false});
  }
})
.patch(requireAuthorization(), upload.none(), async (req, res) => {
  try {
    const {_image, serviceName} = req.body;
    const service = await Service.findOne({name: serviceName});
    await ImageServiceAssociation.updateMany({_service: service._id}, {display: false});
    const isassociation = await ImageServiceAssociation.findOneAndUpdate({_image, _service: service._id}, {display: true}, {new: true})
    res.status(200).json({success: true, isassociation})
  } catch (err) {
    res.status(400).json({success: false});
  }
})
.post(requireAuthorization(), upload.none(), async (req, res) => {
  try {
    const {service, image} = req.body;

    const existingAssociation = await ImageServiceAssociation.find({_service: service, _image: image})

    if(!existingAssociation.length){
      const isassociation = await ImageServiceAssociation.create({_service: service, _image: image})
      res.status(200).json({success: true, isassociation})
    } else {
      throw new Error('duplicate request')
    }
  } catch (err) {
    res.status(400).json({success: false});
  }
})
.delete(requireAuthorization(), upload.none(), async(req, res) => {
  try {
    const {_image, _service} = req.body;
    const isassociation = await ImageServiceAssociation.deleteOne({_image, _service})
    res.status(200).json({success: true, isassociation})
  } catch (err) {
    res.status(400).json({success: false});
  }
})

export default handler;