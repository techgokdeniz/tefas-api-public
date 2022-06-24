const Joi = require("joi");

const OrderSchema = Joi.object({
  serviceid: Joi.number().required(),
  link: Joi.string().regex(RegExp("https://(?:www.)?spotify.com")).required(),
  quantity: Joi.number().min(2).required(),
});

module.exports = { OrderSchema };
