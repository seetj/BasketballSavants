import express from "express";
import databaseConnection from "../db/connection.js";

const router = express.Router();

let databases;

(async () => {
  try {
    databases = await databaseConnection(); // Get the databases once and reuse them in routes
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
})();

router.get("/players/", async (req, res) => {
  const players = await databases.playersDb.listCollections().toArray();
  console.log(players);
  res.send(players).status(200);
});

router.get("/:player", async (req, res) => {
  let stats = await databases.playersDb.collection(`${req.params.player}`);
  let results = await stats.find({}).toArray();
  res.send(results).status(200);
});

router.get("/avg/", async (req, res) => {
  const stats = databases.playersDb.collection("Klay Thompson");

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
  let stats = await databases.playersDb.collection(`${req.params.player}`);

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
  let stats = await databases.playersDb.collection(`${req.params.player}`);
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

router.get("/boxscores/", async (req, res) => {
  try {
    let boxscores = await databases.boxscoresDb.collection("all_boxscoress");

    // Check if the boxscores collection is available
    if (!boxscores) {
      return res.status(500).send("Boxscores collection not found");
    }

    console.log("Collection found");
    const gsw = [
      {
        $match: {
          $or: [
            {
              home: "GSW",
            },
            {
              visitor: "GSW",
            },
          ],
        },
      },
    ];
    const aggCursor = await boxscores.aggregate(gsw).toArray();
    res.send(aggCursor).status(200);
  } catch (err) {
    console.error("Error fetching boxscores:", err);
    res.status(500).send("Error fetching boxscores");
  }
});

export default router;
