import Joi from "joi";

const employeeLoginValidation = Joi.object({
  email: Joi.string()
    .max(100)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()-.,<>]{8,100}$"))
    .max(100)
    .required(),
});

const employeeResetValidation = Joi.object({
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

const employeeGetValidation = Joi.string()
  .max(100)
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .required();

export {
  employeeLoginValidation,
  employeeGetValidation,
  employeeResetValidation,
};
