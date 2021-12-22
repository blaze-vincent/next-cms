import dbConnect from '../../../db/connect'
import multer from 'multer'
import nextConnect from 'next-connect'
import requireAuthorization from '../../../middleware/requireAuthorization'
import ConsultationRequest from '../../../db/models/ConsultationRequest'

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
.delete(requireAuthorization(), async (req, res) => {
    try {
        const {id} = req.query;
        const consultationRequest = await ConsultationRequest.findOneAndDelete({_id: id})
        res.status(200).json({consultationRequest})
    } catch (err) {
        res.status(400).json({error: 'deletion failed'});
    }
})


export default handler;