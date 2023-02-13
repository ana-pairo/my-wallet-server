import httpStatus from "http-status";
import { invalidDataError } from "../errors/invalidData.error.js";
import { loginSCHEMA } from "../modules/sessions/sessions.schema.js";

export function validateLoginBody({ req, res, next }) {
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
