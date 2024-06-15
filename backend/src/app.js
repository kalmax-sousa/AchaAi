import express from "express";
import router from "./routes.js";

import "./database/index.js";

const app = express();

app.use(express.json());

app.use("/api", router);

export default app;
