import httpStatus from "http-status";
import { invalidDataError } from "../errors/invalidData.error.js";
import { loginSCHEMA } from "../modules/sessions/sessions.schema.js";
import { usersSCHEMA } from "../modules/users/users.schema.js";

export function validateLoginBody(req, res, next) {
  const body = req.body;

  const bodyValidation = loginSCHEMA.validate(body, { abortEarly: false });

  if (bodyValidation.error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send(invalidDataError(["E-mail ou senha inválida"]));
  }

  res.locals.loginData = req.body;

  next();
}

export function validateNewUserBody(req, res, next) {
  const body = req.body;

  const bodyValidation = usersSCHEMA.validate(body, { abortEarly: false });

  if (bodyValidation.error) {
    const errors = [];
    bodyValidation.error.details.map((detail) => {
      if (detail.message === '"email" must be a valid email') {
        errors.push("E-mail inválido");
      }
      if (
        detail.message.includes("/^[a-zA-Z]+(?:\\s[a-zA-Z]+)*$/") ||
        detail.message === '"name" is not allowed to be empty'
      ) {
        errors.push("Nome inválido");
      }

      return detail.message;
    });

    return res
      .status(httpStatus.BAD_REQUEST)
      .send(invalidDataError(errors));
  }


  res.locals.newUser = req.body;

  next();
}
