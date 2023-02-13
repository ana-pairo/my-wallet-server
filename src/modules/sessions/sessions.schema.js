import joi from "joi";

export const loginSCHEMA = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .min(4)
    .regex(/\d+/)
    .regex(/[A-Z]/)
    .regex(/[^A-Z a-z0-9]/),
});
