import Joi from "joi";

// validasi untuk login admin dan superadmin
const adminLoginValidation = Joi.object({
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().max(100).required(),
});

// validasi untuk regist admin by superadmin
const adminRegistValidation = Joi.object({
  name: Joi.string().max(100).required(),
  nip: Joi.string().max(16).required(),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().max(100).required(),
});
// validasi untuk reset password
const adminResetValidation = Joi.object({
  name: Joi.string().max(100).required(),
  nip: Joi.string().max(16).required(),
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

// validasi create employee
const createAdminValidation = Joi.object({
  name: Joi.string().max(100).required(),
  nip: Joi.string().max(16).required(),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  role: Joi.string().max(12),
  departmen: Joi.string().max(100),
  join_date: Joi.date().required(),
  quit_date: Joi.date(),
});

// validasi untuk update admin
const adminUpdateValidation = Joi.object({
  name: Joi.string().max(100),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().max(100),
});

// validasi update employee
const adminUpdateEmployeeValidation = Joi.object({
  name: Joi.string().max(100),
  nip: Joi.string().max(16).required(),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  role: Joi.string().max(12),
  departmen: Joi.string().max(100),
  join_date: Joi.date(),
  quit_date: Joi.date(),
});

// validasi untuk search employee
const adminSearchEmployeeValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nip: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
});

export {
  adminLoginValidation,
  adminRegistValidation,
  adminGetValidation,
  adminResetValidation,
  createAdminValidation,
  adminUpdateValidation,
  adminUpdateEmployeeValidation,
  adminSearchEmployeeValidation,
};
