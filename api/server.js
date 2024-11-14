import express from "express";
import cors from "cors";
import stats from "./routes/stats.js";
import boxscores from "./routes/boxscores.js";

const app = express();

app.use(
  cors({
    origin: ["*"],
    methods: ["GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/stats", stats);
app.use("/boxscores", boxscores);

export default app;
