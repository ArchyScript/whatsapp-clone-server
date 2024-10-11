const Joi = require('joi');


const CreateContactValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required().min(10).max(15).pattern(/^\+?[0-9]{10,15}$/, 'phone number'),
  })
  return schema.validate(data);
}



module.exports = { CreateContactValidation, }