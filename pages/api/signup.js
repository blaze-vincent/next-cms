import dbConnect from '../../db/connect'
import multer from 'multer'
import nextConnect from 'next-connect'
import Account from '../../db/models/Account'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
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
.post(upload.none(), requireAuthorization, async (req, res) => {
  try {
    if(process.env.ACCEPTING_NEW_ACCOUNTS){
      const {username, password} = req.body;

      if(!username || !password){
        res.status(400).json({error: 'insufficient details to create account'})
        return;
      }

      if(await Account.findOne({username})){
        res.status(403).json({error: 'account already exists'})
        return;
      }
  
      const passwordHash = await bcrypt.hash(password, 12);
      const account = await Account.create({
        username, 
        passwordHash
      })

      res.status(200).json(account);
      return;
    } else {
      res.status(400).json({error: 'the database is not accepting new accounts at the moment'})
      return;
    }

  } catch (error) {
    res.status(400).json({error});
  }
})

export default handler;