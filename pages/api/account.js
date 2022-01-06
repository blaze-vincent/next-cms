import dbConnect from '../../db/connect'
import multer from 'multer'
import nextConnect from 'next-connect'
import Account from '../../db/models/Account'
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
.get(requireAuthorization({superadminRequired: true}), async (req, res) => {
  try {
    const accounts = await Account.find().select('username isSuperAdmin').exec();

    res.status(200).json({accounts})
  } catch (err) {
    res.status(400).json({error: 'Failed to retrieve accounts. Try reloading.'})
  }
})
.post(requireAuthorization({superadminRequired: true}), upload.none(), async (req, res) => {
  try {
    const {username} = req.body;

    if(!username){
      res.status(400).json({error: 'username is required to create account'})
      return;
    }

    if(await Account.findOne({username})){
      res.status(403).json({error: 'account already exists'})
      return;
    }
    
    const account = await Account.create({
      username
    })

    res.status(200).json(account);
    return;

  } catch (error) {
    res.status(400).json({error});
  }
})
.delete(requireAuthorization({superadminRequired: true}), upload.none(), async (req, res) => {
  try {
    const {id} = req.body;
    //disallow deletion of super admin accounts
    const account = await Account.findOneAndDelete({_id: id, isSuperAdmin: false})
    res.status(200).json({_id: account._id});
  } catch (err) {
    res.status(400).json({error: 'error deleting account'})
  }
})

export default handler;