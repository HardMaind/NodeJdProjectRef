const router = require("express").Router();
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const {createResponse, successResponce,queryErrorRelatedResponse} = require("../helper/sendResponse")

// User register
router.post("/register", async (req, res, next) => {
  try {    
    const {username,email,password,confimPassword}  =req.body;
    if(password !== confimPassword){
      return queryErrorRelatedResponse(req,res,401,"Password did not match.");
    }
    //Create new user          
    const newUser =await User.create({
      username,
      email,
      password,            
    });
    //save user and response    
    createResponse(req,res,newUser);
  } catch (error) {
    next(error);
  }
});

// User login
router.post("/login", async (req, res, next) => {
  try {    
    const user = await User.findOne({ email: req.body.email });
    if(!user) return queryErrorRelatedResponse(req,res,401,"Invalid details!");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
     if(!validPassword) return queryErrorRelatedResponse(req,res,401,"Invalid details!");
    const token = user.generateAuthToken(JSON.parse(JSON.stringify(user)));
    successResponce(req,res,token);
  } catch (error) {
    next(error);
  }
});

module.exports = router;