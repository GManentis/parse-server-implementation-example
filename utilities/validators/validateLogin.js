const Joi = require("joi");

module.exports = (input) => Joi.object({
  username:Joi.string().required().max(255).trim(),
  password:Joi.string().required().max(255).trim()
}).unknown(true).validate(input);
