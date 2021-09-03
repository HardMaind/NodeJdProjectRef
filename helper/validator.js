const Joi =require("joi")
// Validations

// User validation after register
const userValidation = (data)=>{
    const userSchema  = Joi.object({
        address:Joi.string().required(),
        desc:Joi.string().required(),
        email:Joi.string().email().allow(),        
    });
    return userSchema.validate(data);
}
module.exports = {userValidation}