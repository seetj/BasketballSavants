import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/players/", async (req, res) => {
  const players = await db.listCollections().toArray();
  res.send(players).status(200);
});

router.get("/:player", async (req, res) => {
  let stats = await db.collection(`${req.params.player}`);
  let results = await stats.find({}).toArray();
  res.send(results).status(200);
});

router.get("/avg/", async (req, res) => {
  const stats = db.collection("Klay Thompson");

  const averagePoints = [
    {
      $group: {
        _id: null,
        averagePoints: {
          $avg: "$PTS",
        },
      },
    },
  ];

  const aggCursor = await stats.aggregate(averagePoints).toArray();
  res.send(aggCursor).status(200);
});

router.get("/avglast10games/:player/", async (req, res) => {
  let stats = await db.collection(`${req.params.player}`);

  const averagePoints10 = [
    {
      $sort: {
        Date: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $group: {
        _id: null,
        avgPoints: {
          $avg: "$PTS",
        },
      },
    },
    {
      $project: {
        _id: 0,
        avgPoints: 1,
      },
    },
  ];
  const aggCursor = await stats.aggregate(averagePoints10).toArray();
  res.send(aggCursor).status(200);
});

router.get("/last10games/:player/", async (req, res) => {
  let stats = await db.collection(`${req.params.player}`);
  const lastTenGames = [
    {
      $sort: {
        Date: -1,
      },
    },
    {
      $limit: 10,
    },
  ];

  const aggCursor = await stats.aggregate(lastTenGames).toArray();
  res.send(aggCursor).status(200);
});

export default router;
