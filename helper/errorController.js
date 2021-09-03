//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `An account with that ${field} already exists.`;
    res.status(code).send({ isSuccess: false, code, messages: error }); //fields: field
  };
  
//handle field formatting, empty fields, and mismatched passwords
  const handleValidationError = (err, res) => {
    let errors = Object.values(err.errors).map((el) => el.message);
    //   let fields = Object.values(err.errors).map((el) => el.path);
    let code = 400;
    if (errors) {
      const formattedErrors = errors.join(" ");
      res
        .status(code)
        .send({ isSuccess: false, code, messages: formattedErrors }); //fields: fields
    } else {
      res.status(code).send({isSuccess:false,code, messages: errors }); // fields: fields
    }
  };

// handle multer related errors
  const handleMulterError =(err,res)=>{    
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({isSuccess:false,status:400, message: "Too many files."});//err.message
    }else if(err.code === 'LIMIT_FILE_SIZE'){
      return res
      .status(400)
      .json({isSuccess:false,status:400, message: "File is too large."}); //err.message
    }
    else{      
    return res.status(400).json({isSuccess:false,status:400,message:"Something wrong in file uploading."})
    }
  }

// handle file type realted errors 
const handleMulterFileTypeError =(err,res)=>{
return res.status(400).json({isSuccess:false,status:400,message:"File type is not supported."})
}

//error controller function
  module.exports = (err, req, res, next) => {
    try {                  
      if(err.name === "MulterError"){
        return (err = handleMulterError(err,res));
      }
      if(err.message == "Invalid file type."){        
        return (err =handleMulterFileTypeError(err,res))
      }
      if (err.name === "ValidationError") {
        return (err = handleValidationError(err, res));
      }
      if (err.code && err.code == 11000) {
        return (err = handleDuplicateKeyError(err, res));
      }
      next();
    } catch (err) {      
      res.status(500).json({isSuccess:false,status:500,message:"An unknown error occurred."});
    }
  };