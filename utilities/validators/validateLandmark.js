const Joi = require("joi");

module.exports = (input) => Joi.object({
  title: Joi.string().required().max(255).trim(),
  short_info: Joi.string().required().max(255).trim(),
  description: Joi.string().required().max(1000).trim()
}).unknown(true).validate(input);
