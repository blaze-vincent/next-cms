import dbConnect from '../../db/connect'
import multer from 'multer'
import nextConnect from 'next-connect'
import Account from '../../db/models/Account'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
.post(upload.none(), async (req, res) => {
  try {
    const {username, password} = req.body;

    const {passwordHash} = await Account.findOne({username});

    await bcrypt.compare(password, passwordHash).then(result => {
      if(result){
        const token = jwt.sign({
          username
        }, process.env.SECRET, {
          expiresIn: "30m"
        })
        res.status(200).json({token: `Bearer ${token}`})
      } else {
        throw new Error('authorization failed')
      }
    })
  } catch(err){
    res.status(401).json({error: 'authorization failed'});
  }
})


export default handler;