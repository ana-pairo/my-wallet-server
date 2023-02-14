import joi from "joi";

export const usersSCHEMA = joi.object({
    name: joi
        .string()
        .required()
        .trim()
        .regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/),
    email: joi.string().email().required(),
    password: joi
        .string()
        .required()
        .min(4)
        .regex(/\d+/)
        .regex(/[A-Z]/)
        .regex(/[^A-Z a-z0-9]/),
});
