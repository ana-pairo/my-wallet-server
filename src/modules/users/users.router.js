import express from "express";
import { authToken, validateNewUserBody } from "../../middlewares/index.js";
import { createUser, getUser } from "./users.controller.js";

const router = express.Router();

router
    .post("/", validateNewUserBody, createUser)
    .get("/", authToken, getUser);

export default router