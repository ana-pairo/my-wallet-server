import bcrypt from "bcrypt";
import { stripHtml } from "string-strip-html";
import { duplicatedEmailError, notFoundError } from "../../errors/index.js";
import { usersRepository } from "../../repositories/users.repository.js";

async function createNewUser({ newUser }) {
  const isUserRepited = await usersRepository.selectUserByEmail({
    email: newUser.email,
  });

  if (isUserRepited) throw duplicatedEmailError();

  const passwordHash = bcrypt.hashSync(newUser.password, 10);

  const cleanData = {
    ...newUser,
    name: stripHtml(newUser.name).result,
    password: passwordHash,
  }

  const response = await usersRepository.insertNewUser(cleanData);

  return response.insertedId;
}

async function getUserData({ userId }) {
  const userData = await usersRepository.selectUserById({ userId });

  if (!userData) throw notFoundError();

  return {
    name: userData.name,
    email: userData.email
  }
}

const usersService = {
  createNewUser,
  getUserData,
};

export default usersService;
