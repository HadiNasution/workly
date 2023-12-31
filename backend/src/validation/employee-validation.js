import Joi from "joi";

const employeeLoginValidation = Joi.object({
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().max(100).required(),
});

const employeeChangePasswordValidation = Joi.object({
  password: Joi.string().max(100).required(),
});

const employeeResetValidation = Joi.object({
  name: Joi.string().max(100).required(),
  nip: Joi.string().max(16).required(),
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

const employeeGetValidation = Joi.string()
  .max(100)
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .required();

const employeeCreatePermissionValidation = Joi.object({
  type: Joi.string().max(7).required(),
  note: Joi.string().max(255).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

export {
  employeeLoginValidation,
  employeeChangePasswordValidation,
  employeeGetValidation,
  employeeResetValidation,
  employeeCreatePermissionValidation,
};
