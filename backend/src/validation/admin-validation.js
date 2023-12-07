import Joi from "joi";

// validasi untuk login admin dan superadmin
const adminLoginValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

export { adminLoginValidation };
