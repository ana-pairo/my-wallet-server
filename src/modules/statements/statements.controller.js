import httpStatus from "http-status";
import statementsService from "./statements.service.js";

export async function getStatements(req, res) {
  const { userId } = res.locals;

  try {
    const userStatements = await statementsService.getClientAccountStatements({
      userId,
    });

    return res.status(httpStatus.OK).send(userStatements);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createStatement(req, res) {
  const { userId, transactionDetails } = res.locals;

  try {
    await statementsService.createNewAccountStatement({
      userId,
      transactionDetails,
    });

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
