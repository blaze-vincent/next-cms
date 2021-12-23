import nextConnect from 'next-connect'
import dbConnect from '../../db/connect'
import Service from '../../db/models/Service'
import ImageServiceAssociation from '../../db/models/ImageServiceAssociation'
import multer from 'multer'
import requireAuthorization from '../../middleware/requireAuthorization'

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
    let services;
    if(req.query.primary){
      //only query constraint is on home page where i want primary services
      services = await Service.find({secondaryStatus: false}).exec()
    } else {
      services = await Service.find({}).exec()
    }
    
    res.status(200).json({success: true, services})
  } catch(err) {
    res.status(400).json({success: false});
  }
})
.post(requireAuthorization(), upload.none(), async (req, res) => {
  try {
    const {name, description, secondaryStatus} = req.body;
    const dbService = await Service.create({name, description, secondaryStatus});

    res.status(201).json({success: true, dbService});
  } catch(err) {
    res.status(400).json({success: false});
  }
})
.put(requireAuthorization(), upload.none(), async (req, res) => { //no patch, autofill unaltered desc status with unchanged vals
  try {
    const {origName, name, description, secondaryStatus} = req.body;
    const dbService = await Service.findOneAndUpdate({name: origName}, {name, description, secondaryStatus});
    res.status(200).json({success: true, dbService});
  } catch (err) {
    res.status(400).json({success: false});
  }
}) 
.delete(requireAuthorization(), upload.none(), async (req, res) => {
  try {
    const {_id} = req.body;
    await ImageServiceAssociation.deleteMany({_service: _id})
    await Service.deleteOne({_id});

    res.status(200).json({success: true});
  } catch(err) {
    res.status(400).json({success: false});
  }
})

export default handler;