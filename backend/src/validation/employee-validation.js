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
  name: Joi.string().max(100).required(),
  is_wfh: Joi.boolean().required(),
  latitude_in: Joi.number(),
  longitude_in: Joi.number(),
});

export {
  employeeLoginValidation,
  employeeGetValidation,
  employeeResetValidation,
  employeeAbsenInValidation,
};
