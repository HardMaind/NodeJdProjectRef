const fs = require("fs")

module.exports = deleteFiles =(files)=>{ 
    try {  
        // For delete multiple images ...
        if(Array.isArray(files)){
            files.forEach((path) => {
              // Going through every file and check for existance...
                if (fs.existsSync(path)) {
                  fs.unlinkSync(path);
                }
              });
        } else{ 
        // For single image delete ...
          if(fs.existsSync(files)){            
            fs.unlinkSync(files)      
        }  
     }                 
    } catch (error) {
        console.log(error);
    }     
}