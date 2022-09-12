import joi from "joi";
import bcrypt from "bcrypt";
import { stripHtml } from "string-strip-html";
import db from "../database/db.js";

const usersSCHEMA = joi.object({
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

async function createClient(req, res) {
  if (!req.body) {
    res.status(400).send("User não enviado");
    return;
  }

  const user = req.body;

  const userValidation = usersSCHEMA.validate(user, { abortEarly: false });

  if (userValidation.error) {
    const errors = [];
    const validatingErrors = userValidation.error.details.map((detail) => {
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
    res.status(422).send(errors);
    return;
  }

  try {
    const isUserRepited = await db
      .collection("clients")
      .findOne({ email: user.email });
    if (isUserRepited) {
      res.status(409).send("Usuário já cadastrado");
      return;
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

  const passwordHash = bcrypt.hashSync(user.password, 10);

  try {
    const userInserted = await db.collection("clients").insertOne({
      ...user,
      name: stripHtml(user.name).result,
      password: passwordHash,
    });

    res
      .status(201)
      .send(`User ${userInserted.insertedId} cadastrado com sucesso`);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getClientData(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Token não recebido");
    return;
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    const user = await db
      .collection("clients")
      .findOne({ _id: session.userId });

    delete user.password;

    res.send(user.name);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { createClient, getClientData };
