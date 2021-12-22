import nextConnect from 'next-connect'
import dbConnect from '../../db/connect'
import multer from 'multer'
import requireAuthorization from '../../middleware/requireAuthorization'
import AboutInfo from '../../db/models/AboutInfo'

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
    const dbAbout = await AboutInfo.findOne({}).exec()
    res.status(200).json({success: true, dbAbout})
  } catch(err) {
    res.status(400).json({success: false});
  }
})
.post(requireAuthorization(), upload.none(), async (req, res) => {
  try {
    const {paragraph} = req.body;
    await AboutInfo.deleteMany();
    const dbAbout = await AboutInfo.create({paragraph}); //there should only be one

    res.status(201).json({success: true, dbAbout});
  } catch(err) {
    res.status(400).json({success: false});
  }
})

export default handler;