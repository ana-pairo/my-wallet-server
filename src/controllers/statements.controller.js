import joi from "joi";
import extension from "@joi/date";
import db from "../database/db.js";

const Joi = joi.extend(extension);

const statementSCHEMA = joi.object({
  date: Joi.date().format("DD/MM"),
  description: joi.string().trim().required(),
  amount: joi
    .string()
    .required()
    .regex(/^\d{1,6}\.\d{2}$/),
  type: joi.string().required().valid("withdrawal", "deposit"),
});

async function insertNewTransaction(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  const transactionDetails = req.body;

  if (!token) {
    res.status(401).send("Token não recebido");
    return;
  }

  if (!transactionDetails) {
    res.status(400).send("Requisitos não enviados");
    return;
  }

  const dataValidation = statementSCHEMA.validate(transactionDetails, {
    abortEarly: false,
  });

  if (dataValidation.error) {
    const errors = dataValidation.error.details.map((detail) => detail.messade);
    res.status(422).send(errors);
    return;
  }

  try {
    const clientSession = await db.collection("sessions").findOne({ token });

    await db.collection("transactions").insertOne({
      ...transactionDetails,
      clientId: clientSession.userId,
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getClientStatments(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Token não recebido");
    return;
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    const statements = await db.collection("transactions").find().toArray();

    const clientStatements = statements.filter((statement) =>
      statement.clientId.equals(session.userId)
    );

    res.send(clientStatements);
  } catch (error) {
    res.status(500).send(error);
  }
}
export { insertNewTransaction, getClientStatments };
