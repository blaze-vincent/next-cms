import dbConnect from '../../../db/connect'
import multer from 'multer'
import nextConnect from 'next-connect'
import requireAuthorization from '../../../middleware/requireAuthorization'
import ConsultationRequest from '../../../db/models/ConsultationRequest'
import nodemailer from 'nodemailer'

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
        const consultationRequests = await ConsultationRequest.find().sort({createdAt: -1})
        res.status(200).json({consultationRequests})
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

    try {
        let transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            secure: true,
            auth: {
                user: "consultationbot@precisioncoatingsiowa.com", 
                pass: process.env.BOTPASSWORD,
            },
        });
    
        let info = await transporter.sendMail({
            from: '"CONSULTATION BOT" <consultationbot@precisioncoatingsiowa.com>',
            to: "blaze.vincent@hotmail.com",
            subject: "A new consultation request has been submitted",
            text: `Check your admin dashboard to see the new consultation request submitted by ${name}`,
            html: `<b>Check your admin dashboard to see the new consultation request submitted by ${name}</b>`,
        });
    
    } catch (err) {
        console.log(err)
    }

  } catch(err){
    res.status(400).json({error: 'upload failed'});
  }
})


export default handler;