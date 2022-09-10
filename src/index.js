import express from "express";
import cors from "cors";
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

const server = express();
server.use(cors());
server.use(express.json());

// POST NEW USER

server.post("/clients", createClient);

server.post("/sessions", openClientSession);

server.get("/clients", getClientData);

server.post("/wallet", insertNewTransaction);

server.get("/wallet", getClientStatments);

server.delete("/sessions", closeClientSession);

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
