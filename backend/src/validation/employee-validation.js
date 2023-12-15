import Joi from "joi";

const employeeLoginValidation = Joi.object({
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
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

const employeeAbsenInValidation = Joi.object({
  is_wfh: Joi.boolean().required(),
  latitude_in: Joi.number().optional(),
  longitude_in: Joi.number().optional(),
});

const employeeAbsenOutValidation = Joi.object({
  latitude_out: Joi.number().optional(),
  longitude_out: Joi.number().optional(),
});

const employeeCreatePermissionValidation = Joi.object({
  type: Joi.string().max(7).required(),
  note: Joi.string().max(255).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

export {
  employeeLoginValidation,
  employeeGetValidation,
  employeeResetValidation,
  employeeAbsenInValidation,
  employeeAbsenOutValidation,
  employeeCreatePermissionValidation,
};
