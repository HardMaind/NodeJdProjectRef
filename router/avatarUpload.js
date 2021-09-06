const router =require("express").Router();
const authenticUser = require("../helper/verifyAppUser");
const User  = require("../Model/User");
const {singleFileUpload, multiFileUpload} =require("../helper/imageUpload");
const {successResponceOfAvatar,queryErrorRelatedResponse} = require("../helper/sendResponse");
const deleteFiles = require("../helper/deletefiles");

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

module.exports =router;

