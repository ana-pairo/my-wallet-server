import db from "../config/database.js";

async function selectSessionByToken({ token }) {
  return db.collection("sessions").findOne({ token });
}

async function insertNewSession({ data }) {
  const response = await db.collection("sessions").insertOne({
    ...data,
  });
  console.log("resposta do banco", response)

  return response
}

async function deleteSession({ token }) {
  return db.collection("sessions").deleteOne({ token });
}

export const sessionsRepository = {
  selectSessionByToken,
  insertNewSession,
  deleteSession,
};
