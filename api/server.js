import express from "express";
import cors from "cors";
import stats from "./routes/stats.js";
import boxscores from "./routes/boxscores.js";
const PORT = process.env.PORT || 5050;
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

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
