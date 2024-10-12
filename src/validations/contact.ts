 
import Joi from 'joi'; 

const contactValidationSchema = Joi.object({
  userId: Joi.string().required(), 
  contactId: Joi.string().required(),   
  name: Joi.string().min(3).required(),  
  isBlocked: Joi.boolean().optional(),
  savedContact: Joi.boolean().optional(),
});

export {  contactValidationSchema };
