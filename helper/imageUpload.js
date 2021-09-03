const multer = require("multer");

// Single image upload realted code for multer ...
function singleFileUpload(path,allowedMimes,fileSize, name){

  // For store image or files over folder..
  const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(
      null,
       Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase()
    );
  },
});

  // For filter image or file types...
  const fileFilter = ((req,file,cb)=>{  
    if(allowedMimes.includes(file.mimetype)){
      cb(null,true)
    }else{
      const error = new Error("Invalid file type.");
      error.httpStatuscode =422;
      error.errorMessage = "Invalid file type.";
      return cb(error)
    }
  });

  // Return valid image...
  return multer({
  storage: storage,
  limits:{
    fileSize:fileSize
  },
  fileFilter: fileFilter
  }).single(name);

}

// Multi images upload related code for multer ...
function multiFileUpload(path,allowedMimes,fileSize, name){

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(
        null,
         Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase()
      );
    },
  });
  
  const fileFilter = ((req,file,cb)=>{  
      if(allowedMimes.includes(file.mimetype)){
        cb(null,true)
      }else{
        const error = new Error("Invalid file type.");
        error.httpStatuscode =422;
        error.errorMessage = "Invalid file type.";
        return cb(error)
      }
  });
  
  return multer({
    storage: storage,
    limits:{
      fileSize:fileSize
    },
    fileFilter: fileFilter
  }).array(name);
}


module.exports = {singleFileUpload,multiFileUpload};
