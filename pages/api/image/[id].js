import dbConnect from '../../../db/connect'
import Image from '../../../db/models/Image'
import nextConnect from 'next-connect'
import requireAuthorization from '../../../middleware/requireAuthorization'


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
  const {id} = req.query;
  const image = await Image.findOne({_id: id});
  if(image){
    res.status(200).json(image);
    return;
  } else {
    res.status(404).end();
    return;
  }
})
.patch(requireAuthorization(), async (req, res) => {
  try {
    //currently only for updating homeImage status
    const {id, route} = req.query //home or about
    let image = null;
    switch(route){
      case 'home':
        await Image.updateMany({}, {homeImage: false})
        image = await Image.findOneAndUpdate({_id: id}, {homeImage: true})
        break;

      case 'about':
        await Image.updateMany({}, {aboutImage: false})
        image = await Image.findOneAndUpdate({_id: id}, {aboutImage: true})
        break;

      default: 

        res.status(400).json({
          error: "query must include route field with value of 'home' or 'about'"
        })
        return;
    }

    res.status(200).json({image})
  } catch (err) {
    res.status(400).json({error: 'patch failed'});
  }
})

export default handler;