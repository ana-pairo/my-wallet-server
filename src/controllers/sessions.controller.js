import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import joi from "joi";
import db from "../config/database.js";

const loginSCHEMA = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .min(4)
    .regex(/\d+/)
    .regex(/[A-Z]/)
    .regex(/[^A-Z a-z0-9]/),
});

async function openClientSession(req, res) {
  if (!req.body) {
    res.status(400).send("User não enviado");
    return;
  }

  const login = req.body;

  const loginValidation = loginSCHEMA.validate(login, { abortEarly: false });

  if (loginValidation.error) {
    res.status(422).send("E-mail ou senha inválida");
    return;
  }

  const token = uuid();

  try {
    const user = await db.collection("clients").findOne({ email: login.email });

    if (user && bcrypt.compareSync(login.password, user.password)) {
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });

      res.status(201).send(token);
    } else {
      res.status(401).send("E-mail não cadastrado e/ou senha incorreta");
      return;
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function closeClientSession(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Token não recebido");
    return;
  }

  try {
    await db.collection("sessions").deleteOne({ token });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { openClientSession, closeClientSession };
