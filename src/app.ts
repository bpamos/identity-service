import express from "express";
import { identityRouter } from "./routes/identity";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(identityRouter);
  return app;
}
