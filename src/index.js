import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  createClient,
  getClientData,
} from "./controllers/clients.controller.js";
import {
  openClientSession,
  closeClientSession,
} from "./controllers/sessions.controller.js";
import {
  getClientStatments,
  insertNewTransaction,
} from "./controllers/statements.controller.js";


dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.post("/clients", createClient);

server.post("/sessions", openClientSession);

server.get("/clients", getClientData);

server.post("/wallet", insertNewTransaction);

server.get("/wallet", getClientStatments);

server.delete("/sessions", closeClientSession);

server.listen(process.env.PORT, () => {
  console.log(`Listening to PORT ${process.env.PORT}`);
});
