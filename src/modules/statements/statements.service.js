import { statementsRepository } from "../../repositories/index.js";

async function getClientAccountStatements({ userId }) {
  const statements = await statementsRepository.selectTransactionsByUserId({
    userId,
  });

  return statements;
}

async function createNewAccountStatement({ userId, transactionDetails }) {
  const data = {
    ...transactionDetails,
    userId,
  };

  return statementsRepository.insertNewTransaction({ data });
}

const statementsService = {
  getClientAccountStatements,
  createNewAccountStatement,
};

export default statementsService;
