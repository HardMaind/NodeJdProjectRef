const User = require("../Model/User");
const deleteFiles = require("../helper/deletefiles");
const bcrypt = require("bcrypt");
const {userValidation}=require("../helper/validator"); 
const {successResponce,deleteResponce,queryErrorRelatedResponse} = require("../helper/sendResponse");
const { sendMail } = require("../helper/emailSender");
const fs = require("fs");
const path = require("path");

// File path that store email details
const filePath =path.join(__dirname,"../helper/emailSender.js");
const readFile = fs.readFileSync(filePath);
// Convet buff into string
const fileData = readFile.toString();
// Get email id of email file deatils
const emailOfFileIs =fileData.match(new RegExp('^.*' + 'user' + '.*$', 'gm')).toString().trim().replace("user: ","");

// Get single user by authenticate token (It's also possiable with params or else...)
const getSingleUser = async (req,res,next)=>{
    try {
    const user  = await User.findById(req.user._id);
    if(!user) return queryErrorRelatedResponse(req,res,202,"User not found.");
    successResponce(req,res,user) 
    } catch (error) {
        next(error);
    }
}

// Update user by authenticate token (It's also possiable with params or anything else ...)
const updateUser = async (req,res,next)=>{
    try {
        const {error} = userValidation(req.body);        
        if(error) return queryErrorRelatedResponse(req,res,400,`${error.details[0].message.replace(/"/g,'')}.`)
        const updatedBody =req.body;
        const data = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updatedBody },{ new: true }); 
        successResponce(req,res,data);
    } catch (error) {
        next(error);
    }
}

// Delete a single user by token 
const deleteUser = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user._id);
        if(!user) return queryErrorRelatedResponse(req,res,400,"User not found.");
        deleteFiles(user.profilePicture);
        deleteFiles(user.coverPicture);
        user.delete();
        deleteResponce(req,res,"User deleted successfully.");        
    } catch (error) {
        next(error);
    }
}

// Delete a multiple users with there Id's
const deleteMultiUsers =async (req,res,next)=>{
    try {
        const multiUser = req.body;
        multiUser.map(async (item)=>{            
            const user = await User.findById(item); 
                deleteFiles(user.profilePicture);
                deleteFiles(user.coverPicture);          
                user.delete();
        });
        deleteResponce(req,res,"All selected users deleted successfully.");
    } catch (error) {
        next(error);
    }
}

// Change user password with old password
const changePassword  = async (req,res,next)=>{
    try {
        const {oldPassword,newPassword,confimPassword} =req.body;
        const user = await User.findById(req.user._id);
        if(!user) return queryErrorRelatedResponse(req,res,400,"User not found.");
        if(newPassword !== confimPassword){
            return queryErrorRelatedResponse(req,res,401,"Password did not match.");
        }
        const validPassword = await bcrypt.compare(
            oldPassword,
            user.password
          );
          if(!validPassword) return queryErrorRelatedResponse(req,res,401,"Invalid details!");
        user.password = newPassword;
        await user.save();
          successResponce(req,res,"Password changed successfully!");
    } catch (error) {
        next(error)
    }
}

// Forgot user password with nodemailder
const forgotPassword = async (req,res,next)=>{
    try {
        const {cc,email} = req.body
        const user = await User.findOne({email,_id:req.user._id});
        if(!user) return queryErrorRelatedResponse(req,res,400,"Email is not registered at or may be something wrong.");        
        const otp = Math.floor(1000 + Math.random() * 9000);           
        const expireOtpTime =Date.now() + 360000; 
        user.otp = otp;
        user.expireOtpTime = expireOtpTime;
        await user.save();
        sendMail({
            from:emailOfFileIs,
            to: req.body.email,
            cc: cc,
            sub: "Forgot Password",
            html:` You One Time Password  is : ${otp}<br/> Your OTP code is expire in : 5 minutes (${new Date(expireOtpTime).toString()}).`, //${new Date(expireOtpTime).toString()}.(In 5 min)
        });
        successResponce(req,res,"Please check you mail. (If you not get then check over spam.)");
    } catch (error) {        
        next(error);
    }
}

// Reset user password by send mail OTP
const resetUserPassword = async (req,res,next)=>{
    try {
        const {otp,newPassword,confimPassword} = req.body;
        const user = await User.findOne({_id:req.user._id,otp});
        if(!user) return queryErrorRelatedResponse(req,res,400,"OTP is wrong!!");
        if(newPassword !== confimPassword){
            return queryErrorRelatedResponse(req,res,401,"Password did not match.");
        }        
        if(new Date(user.expireOtpTime).toTimeString() <=new Date(Date.now()).toTimeString()){
            return queryErrorRelatedResponse(req,res,401,"OTP is expired :(");
        }
        user.otp=null;
        user.password=newPassword;
        await user.save();
        successResponce(req,res,"You password is changed!😊");
    } catch (error) {
        next(error);
    }
}

// Contact us or send feedBack related With mail
const sendFeedBack =async (req,res,next)=>{ 
    try {        
        const {cc,data} = req.body;    
        const user  = await User.findById(req.user._id);
        if(!user) return queryErrorRelatedResponse(req,res,400,"User not found.");                
        // if(!req.file) return queryErrorRelatedResponse(req,res,400,"File dose not found.");
        let attachments;
        if(req.file){
         attachments={filename:req.file.filename,content: req.file.buffer,contentType:req.file.mimetype};
        }        
        let mailData = {
            from:user.email,
            to:emailOfFileIs,
            cc:cc,
            sub:"Contact us",
            html:`Sender Email : ${user.email}<br/>Sender Name : ${user.username}<br/> Subject : ${data}`,
        }
        if(attachments !== undefined || null){
            const pair  = {attachments};
            mailData =  {...mailData,...pair};
        }
        sendMail(mailData);
        successResponce(req,res,"Send details successFully!!");
    } catch (error) {
        console.log(error,"Error");
        next(error);
    }
}

module.exports = {
    getSingleUser,updateUser,deleteUser,deleteMultiUsers,
    changePassword,forgotPassword,resetUserPassword,sendFeedBack}

