const router = require("express").Router();
const authenticUser = require("../helper/verifyAppUser");
const { getUser ,getSingleUser,updateUser,deleteUser,
    deleteMultiUsers, changePassword,forgotPassword,resetUserPassword} = require("../controllers/userController");



// // Get all users
router.get("/all",getUser);

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
router.post("/resetPassword",authenticUser,resetUserPassword)
module.exports = router;

