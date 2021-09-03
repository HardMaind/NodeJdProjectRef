const router = require("express").Router();
const authenticUser = require("../helper/verifyAppUser");
const {getSingleUser,updateUser,deleteUser,
    deleteMultiUsers, changePassword,forgotPassword,resetUserPassword,sendFeedBack} = require("../controllers/userController");


// // Get single user
router.get("/userInfo",authenticUser,getSingleUser);

// // Edit user
router.put("/update", authenticUser, updateUser);

// // Delete single user
router.delete("/delete",authenticUser,deleteUser);

// // Delete multiple users
router.delete("/deleteMultiUser",authenticUser,deleteMultiUsers);

// //Change user password using old password
router.patch("/changePassword",authenticUser,changePassword);

// //Forgot user password 
router.patch("/forgotPassword",authenticUser,forgotPassword);

// // Reset user password by otp send with email
router.post("/resetPassword",authenticUser,resetUserPassword);

// // Contact us
router.post("/contactUs",authenticUser,sendFeedBack);
module.exports = router;

