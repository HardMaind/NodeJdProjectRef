const router =require("express").Router();
const authenticUser = require("../helper/verifyAppUser");
const User  = require("../Model/User");
const {singleFileUpload, multiFileUpload} =require("../helper/imageUpload");
const {successResponceOfAvatar,queryErrorRelatedResponse} = require("../helper/sendResponse");
const deleteFiles = require("../helper/deletefiles");
const path = require("path");
const fs = require("fs");

// Here is your server running URL
const serverUrl  = "http://localhost:5051/";

// Upload Avatar
router.post("/avatar",authenticUser,singleFileUpload("public",["image/png","image/jpeg","image/jpg"],1024*1024,"avatar"),
        async(req,res,next)=>{
            try {
                const user =await User.findById(req.user._id);    
                // Checking for user existance with authenticate(JWT) token
                if(!user) return queryErrorRelatedResponse(req,res,202,"User not found.");                
                // Checking for file (User selected or not)...
                if(!req.file.path) return queryErrorRelatedResponse(req,res,400,"File not found.");   
                //If file is already exist then is must be delete first 
                // Useing deleteFiles function delete the exist file
                if(user.profilePicture){                                 
                    deleteFiles(user.profilePicture);
                };
                // Update user with the user Avatar using findByIdAndUpdate
                const updateUserAvatar = await User.findByIdAndUpdate(user._id,{
                    $set:{profilePicture:req.file.path}
                    },{new:true}); 
                // Set base URL for sending to the client which content server url and image path
                const baseUrl =serverUrl+ updateUserAvatar.profilePicture;   
                // Sending success response using success response for avatar
                successResponceOfAvatar(req,res,"Avatar Updated!",baseUrl);
            } catch (error) {
                next(error)
            }  
});

// Use to upload multipal images or files (All the things are working same as single upload.Diff is array of files)
router.post("/multiAvatar",authenticUser,multiFileUpload("public",["image/png","image/jpeg","image/jpg"],1024*1024,"avatar"),
    async(req,res,next)=>{
        try {
            const user =await User.findById(req.user._id);                            
            if(!user) return queryErrorRelatedResponse(req,res,202,"User not found.");                
            if(!req.files) return queryErrorRelatedResponse(req,res,400,"File not found.");                
            if(user.coverPicture){   
                deleteFiles(user.coverPicture);
            };  
            // Add all files path in one array so easly update userInfo.
            let filesPath = [];
            req.files.map(item=>{            
            return filesPath.push(item.path)
            });            
            const updateUserAvatar = await User.findByIdAndUpdate(user._id,{
                $set:{coverPicture:filesPath}
            },{new:true});
            const baseUrl =serverUrl+updateUserAvatar.coverPicture[0];                             
            successResponceOfAvatar(req,res,"Multi avatar Updated!",baseUrl);
        } catch (error) {
            next(error);
        }
});

// change send email details
router.post("/changeSendEmailDetails",(req,res)=>{
    const {email,password} =req.body;
    const filePath  = "/home/user/A Hardik/NodeJS/helper/emailSender.js";
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
    from: "${email}",
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
module.exports =router;
