import jwt from 'jsonwebtoken'

export default function requireAuthorization(specialRequest = {superadminRequired: false}){
  return function(req, res, next){
    const {authorization} = req.headers;
    try{
      const payload = jwt.verify(authorization.split(' ')[1], process.env.SECRET);
      if(specialRequest.superadminRequired){
        if(!payload.isSuperAdmin){
          res.status(403).json({error: 'Your account type has insufficient privileges to view this content.'});
          return;
        }
      }
      next()
    } catch(err){
      res.status(401).json({error: `Authentication failed.`});
      return;
    }
  }
}