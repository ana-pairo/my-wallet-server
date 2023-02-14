import httpStatus from "http-status";
import usersService from "./users.service.js";

export async function createUser(req, res) {
  console.log("agora no controller com locals", res.locals.newUser);
  const { newUser } = res.locals;

  console.log("newUser", newUser)

  try {
    console.log("entrei no try do controler")
    const newIdUser = await usersService.createNewUser({ newUser });

    console.log("passeo do await do controller dentro do try")
    res
      .status(httpStatus.CREATED)
      .send(`User ${newIdUser} cadastrado com sucesso`);
  } catch (error) {
    console.log("vim pro catch com erro", error)
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send("Usuário já cadastrado");
    }

    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getUser(req, res) {
  const { userId } = res.locals;

  try {
    const user = await usersService.getUserData({ userId });

    return res.status(httpStatus.OK).send(user)
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND)
  }
}
