const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { queryErrorRelatedResponse } = require("./sendResponse");


module.exports = async function (req, res, next) {
  let token = req.header("Authorization");

  if (token) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
  
  if (!token) return queryErrorRelatedResponse(req,res,401,"Access Denied."); 

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    let user = await User.findById(verified._id);
    if (!user) return queryErrorRelatedResponse(req,res,401,"Access Denied.");  
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    queryErrorRelatedResponse(req,res,400,"Invalid Token.")    
  }
};