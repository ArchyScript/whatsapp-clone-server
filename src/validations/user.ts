 
import Joi from 'joi';
   
export const userValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
  avatarUrl: Joi.string().uri().optional(),
  status: Joi.string().optional(),
}); 
