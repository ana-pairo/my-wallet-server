import express from "express";
import { createStatement, getStatements } from "./statements.controller.js";
import {
  authToken,
  validateNewTransactionBody,
} from "../../middlewares/index.js";

const router = express.Router();

router
  .get("/", authToken, getStatements)
  .post("/", authToken, validateNewTransactionBody, createStatement);

export default router;
