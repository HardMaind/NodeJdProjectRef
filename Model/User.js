const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      minLength: [3, "Username must be three characters long."],
      mixLength: [20, "Username not more than twenty characters."],
      unique: true,
      trim:true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      max: 50,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            v
          );
        },
        message: "email must be a valid email.",
      },
      trim:true
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: [6, "Password should be at least six characters long."],
      trim:true
    },
    profilePicture: {
      type: String,      
    },
    coverPicture: {
      type: [String],
    },
    followers: {
      type: Array,
      default: [],
    },
    address: {
      type: String,    
    },   
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    otp:{
      type:Number,
      default:null
    },
    expireOtpTime:{
      type:Date,
      default:null
    }
  },

  { timestamps: true }
);

// Bcrypt password before save
userSchema.pre("save", async function (next) {
  const user = this;
  if(user.isModified("password")){    
    user.password = await bcrypt.hash(user.password, 12);
  }else{
    user.password = await bcrypt.hash(user.password, 12);    
  }
  next();
});


/*userSchema.pre("findOneAndUpdate", async function (next) {
  const user =this;
  if(user.isModified("password")){
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});*/

// Generate auth token
userSchema.methods.generateAuthToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  // Here add all the user info data send on login time (Data may be full data of user or it may be
  // store as given info)
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.TOKEN_SECRET);
  return token;
};

// Delete some info that not required for client
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.__v;
  delete userObj.password;
  delete userObj.otp;
  // //Assign values
  // if (userObj.profilePicture) {
  //   userObj.profilePicture = process.env.BASE_URL + userObj.profilePicture;
  // } else {
  //   userObj.avatar = "";
  // }
  return userObj;
};

module.exports = mongoose.model("user", userSchema);