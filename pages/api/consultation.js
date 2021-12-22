import dbConnect from '../../db/connect'
import multer from 'multer'
import nextConnect from 'next-connect'
import requireAuthorization from '../../middleware/requireAuthorization'
import ConsultationRequest from '../../db/models/ConsultationRequest'

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
.get(requireAuthorization(), async (req, res) => {
    try {
        //get all from db organized by latest first
        
    } catch (err) {
        res.status(401).json({error: 'authorization failed'});
    }
})
.post(upload.none(), async (req, res) => {
  try {
    const {name, email, phone, zipcode, comment, services = []} = req.body;
    const consultationRequest = await ConsultationRequest.create({
        name,
        email,
        phone,
        zipcode,
        comment,
        services: services.split(',')
    });
    res.status(200).json({consultationRequest});
    
  } catch(err){
    res.status(401).json({error: 'upload failed'});
  }
})


export default handler;