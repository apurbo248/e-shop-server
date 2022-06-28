const jwt = require("jsonwebtoken");
const User = require("../model/AllUserSchema");

const verifyToken = async (req, res, next) => {

 let token;

 if (req.headers?.authorization?.startsWith('Bearer ')) {
    token = req.headers?.authorization?.split('Bearer ')[1];
  }
  
   if (!token) {
     res.status(403).json({ msg: "You don't have any access token !" });
     return;
   }

  const decode =await jwt.verify(token, process.env.ACCESS_TOKEN);
  req.user = await User.findById(decode.id);


  next();
};

module.exports = verifyToken;
