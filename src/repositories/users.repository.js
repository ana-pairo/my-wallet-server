import db from "../config/database.js";

async function selectUserByEmail({ email }) {
  return db.collection("users").findOne({ email });
}

async function insertNewUser(data) {
  return db.collection("users").insertOne({
    ...data,
  });
}

async function selectUserById({ userId }) {
  return db.collection("users").findOne({
    _id: userId,
  });
}

export const usersRepository = {
  selectUserByEmail,
  insertNewUser,
  selectUserById,
};
