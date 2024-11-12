import express from "express";
import database from "../db/connection.js";

const router = express.Router();
const boxscoresCollection = database.collection("scores");

router.get("/:date/", async (req, res) => {
  const boxscores = [
    {
      $match: {
        DATE: {
          $eq: new Date(`${req.params.date}T00:00:00.000+00:00`),
        },
      },
    },
  ];

  const aggCursor = await boxscoresCollection.aggregate(boxscores).toArray();
  res.send(aggCursor).status(200);
});

export default router;
