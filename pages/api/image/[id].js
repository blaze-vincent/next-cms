import dbConnect from '../../../db/connect'
import Image from '../../../db/models/Image'
import ImageServiceAssociation from '../../../db/models/ImageServiceAssociation'
import multer from 'multer'
import nextConnect from 'next-connect'


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
  //database will not grow to a crazy degree so this assumes no overlap in image and service ids
  const {id} = req.query;
  const image = await Image.findOne({_id: id});
  if(image){
    res.status(200).json(image);
    return;
  }
  const isa = await ImageServiceAssociation.findOne({_service: id});
  if(isa){
    const img = await Image.findOne({_image: isa._image});
    res.status(200).json({image: img});
    return;
  }
  res.status(404).end();
  return;
})

export default handler;