import Joi from "joi";

// validasi untuk login admin dan superadmin
const adminLoginValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

// validasi untuk regist admin by superadmin
const adminRegistValidation = Joi.object({
  name: Joi.string().max(100).required(),
  nip: Joi.string().max(16).required(),
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

export { adminLoginValidation, adminRegistValidation };
