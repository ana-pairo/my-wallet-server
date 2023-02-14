import express from "express";
import cors from "cors";
import sessionsRouter from "./modules/sessions/sessions.router.js";
import usersRouter from "./modules/users/users.router.js"

const app = express();

app
  .use(cors())
  .use(express.json())
  .get("/status", (req, res) => res.send("Ok"))
  .use("/sessions", sessionsRouter)
  .use("/users", usersRouter);

export default app;
