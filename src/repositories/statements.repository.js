import db from "../config/database.js";

async function insertNewTransaction({ data }) {
  return db.collection("transactions").insertOne({
    ...data,
  });
}

async function selectTransactionsByUserId({ userId }) {
  return db
    .collection("transaction")
    .find({
      clientId: userId,
    })
    .toArray();
}

export const statementsRepository = {
  insertNewTransaction,
  selectTransactionsByUserId,
};
