import Joi from "joi";

// validasi untuk login admin dan superadmin
const adminLoginValidation = Joi.object({
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()-.,<>]{8,100}$"))
    .max(100)
    .required(),
});

// validasi untuk regist admin by superadmin
const adminRegistValidation = Joi.object({
  name: Joi.string()
    .pattern(new RegExp("^[a-zA-Z]{1,100}$"))
    .max(100)
    .required(),
  nip: Joi.string().pattern(new RegExp("^[0-9]{6,16}$")).max(16).required(),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()-.,<>]{8,100}$"))
    .max(100)
    .required(),
});
// validasi untuk reset password
const adminResetValidation = Joi.object({
  name: Joi.string()
    .pattern(new RegExp("^[a-zA-Z]{1,100}$"))
    .max(100)
    .required(),
  nip: Joi.string().pattern(new RegExp("^[0-9]{6,16}$")).max(16).required(),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

//validasi get admin
const adminGetValidation = Joi.string()
  .max(100)
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .required();

export {
  adminLoginValidation,
  adminRegistValidation,
  adminGetValidation,
  adminResetValidation,
};
