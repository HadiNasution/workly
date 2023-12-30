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
  quit_date: Joi.date().required(),
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
  id: Joi.number().required(),
  name: Joi.string().max(100).optional(),
  nip: Joi.string().max(16).optional(),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .optional(),
  role: Joi.string().max(12).optional(),
  departmen: Joi.string().max(100).optional(),
  join_date: Joi.date().optional(),
  quit_date: Joi.date().optional(),
});

// validasi untuk search employee
const adminSearchEmployeeValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nip: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
});

// validasi untuk setting
const adminUpdateSetting = Joi.object({
  office_radius: Joi.number().min(1).optional(),
  office_latitude: Joi.number().optional(),
  office_longitude: Joi.number().optional(),
  office_address: Joi.string().max(255).optional(),
  office_name: Joi.string().max(255).optional(),
  default_password: Joi.string().max(255).optional(),
  time_in: Joi.number().optional(),
  time_out: Joi.number().optional(),
  minute_late_limit: Joi.number().min(1).optional(),
  wfh_limit: Joi.number().optional(),
  leaves_limit: Joi.number().optional(),
  enable_wfh: Joi.boolean().optional(),
  using_shot: Joi.boolean().optional(),
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
  adminUpdateSetting,
};
