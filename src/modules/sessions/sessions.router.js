import express from "express";
import { registerNewSession, closeUserSession } from "./sessions.controller.js";
import { authToken, validateLoginBody } from "../../middlewares/index.js"

const router = express.Router();

router
    .post("/", validateLoginBody, registerNewSession)
    .delete("/", authToken, closeUserSession);

export default router;
