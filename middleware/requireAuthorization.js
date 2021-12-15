import jwt from 'jsonwebtoken'

export default function requireAuthorization(){
  return function(req, res, next){
    const {authorization} = req.headers;
    try{
      const payload = jwt.verify(authorization.split(' ')[1], process.env.SECRET);
      next()
    } catch(err){
      res.status(401).json({error: `authentication failed.`});
      return;
    }
  }
}