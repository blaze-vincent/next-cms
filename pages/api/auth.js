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
    if(req.headers.cookie){
      const {cookie} = req.headers;
      const token = cookie.split(' ')[1];
      jwt.verify(token, process.env.SECRET)
      res.status(200).json({token: cookie.split('=')[1]})
    } else if(req.body.username && req.body.password){
      const {username, password} = req.body;

      const {_id, passwordHash = null, isSuperAdmin = false} = await Account.findOne({username});
  
      //only works on first login
      //resetting password requires that a superadmin delete and recreate account 
      let passHash; //passwordHash extracted from Account.findOne is read-only
      if(!passwordHash){
        passHash = await bcrypt.hash(password, 12);
        await Account.updateOne({_id}, {passwordHash: passHash})
      }

      await bcrypt.compare(password, passwordHash || passHash).then(result => {
        if(result){
          const token = jwt.sign({
            username,
            isSuperAdmin
          }, process.env.SECRET, {
            expiresIn: "30m"
          })
          res.status(200).json({token: `Bearer ${token}`})
        } else {
          throw new Error('authorization failed')
        }
      })
    } 
  } catch(err){
    res.status(401).json({error: 'authorization failed'});
  }
})


export default handler;