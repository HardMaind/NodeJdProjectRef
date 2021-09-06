const router  = require("express").Router();
const User = require("../Model/User");
const {successResponce} = require("../helper/sendResponse");

const fs = require("fs");
const path =require("path");

// Get all users
router.get("/allUsers",async (req,res,next)=>{
    try {        
    const users = await User.find();    
    successResponce(req,res,users);
    } catch (error) {
        next(error);
    }
});

// change send email details
router.post("/changeSendEmailDetails",(req,res)=>{
    const {email,password} =req.body;
    const filePath =path.join(__dirname,"../helper/emailSender.js");
    const fileData = `
const nodemailer = require("nodemailer");

const sendMail = (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: false,
    auth: {
      user: "${email}",
      pass:"${password}",
    },
  });
  const mailOptions = {
    from:data.from,
    to: data.to,
    subject: data.sub,
    html: data.html,
    cc: data.cc,
    attachments: data.attachments,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    // else {
    //   console.log("Email sent: " + info.response);
    // }
  });
};

module.exports.sendMail = sendMail;`
        
        const file = fs.openSync(filePath,'w+');                        
        fs.writeFile(file, fileData,(err)=>{
            if(err) return console.log(err); 
        });     
    res.status(200).json({isSuccess:true,status:200,message:"Send mail function details changes."});
});

module.exports = router