import joi from "joi";
import extension from "@joi/date";

const Joi = joi.extend(extension);

export const newTransactionSCHEMA = joi.object({
  date: Joi.date().format("DD/MM"),
  description: joi.string().trim().required(),
  amount: joi.number().min(0.01).max(999999.99).required(),
  type: joi.string().required().valid("withdrawal", "deposit"),
});
