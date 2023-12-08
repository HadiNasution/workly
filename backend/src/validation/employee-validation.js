import Joi from "joi";

const employeeLoginValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

const employeeGetValidation = Joi.string().max(100).email().required();

export { employeeLoginValidation, employeeGetValidation };
