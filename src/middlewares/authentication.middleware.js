import httpStatus from "http-status";
import { unauthorizedError } from "../errors/index.js";
import { sessionsRepository } from "../repositories/index.js";

export async function authToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return unauthorizedResponse(res);

  const token = header.replace("Bearer ", "");

  try {
    const { userId } = await sessionsRepository.selectSessionByToken({ token });

    if (!userId) return unauthorizedResponse(res);

    res.locals.userId = userId;
    res.locals.token = token;
  } catch (error) {
    return unauthorizedResponse(res);
  }

  next();
}

function unauthorizedResponse(res) {
  res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}
