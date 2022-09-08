import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import joi from "joi";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("myWallet");
});

//SCHEMAS
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

// POST NEW USER

server.post("/sign-up", async (req, res) => {
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
    console.log(validatingErrors);
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
      password: passwordHash,
    });

    res
      .status(201)
      .send(`User ${userInserted.insertedId} cadastrado com sucesso`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

server.post("/", async (req, res) => {
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
});

server.get("/my-wallet", async (req, res) => {
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
});

server.delete("/sessions", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Token não recebido");
    return;
  }

  try {
    const response = await db.collection("sessions").deleteOne({ token });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
