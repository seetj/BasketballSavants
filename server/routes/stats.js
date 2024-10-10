import express from "express";
import database from "../db/connection.js";

const router = express.Router();
const playersCollection = database.collection("players_22-23");

router.get("/players/", async (req, res) => {
  const names = await playersCollection
    .find({}, { projection: { _id: 1 } })
    .toArray();
  res.send(names).status(200);
});

router.get("/last10games/:player/", async (req, res) => {
  const lastTenGames = [
    {
      $match: {
        name: `${req.params.player}`,
      },
    },
    {
      $project: {
        games_played: {
          $slice: ["$games_played", -10],
        },
      },
    },
  ];

  const aggCursor = await playersCollection.aggregate(lastTenGames).toArray();
  res.send(aggCursor).status(200);
});

router.get("/:player/averages", async (req, res) => {
  const careerAverage = [
    {
      $unwind: {
        path: "$games_played",
      },
    },
    {
      $group: {
        _id: `${req.params.player}`,
        avg_MP: {
          $avg: "$games_played.stats.MP",
        },
        avg_FG: {
          $avg: "$games_played.stats.FG",
        },
        avg_FGA: {
          $avg: "$games_played.stats.FGA",
        },
        avg_3P: {
          $avg: "$games_played.stats.'3P'",
        },
        avg_3PA: {
          $avg: "$games_played.stats.'3PA'",
        },
        avg_PTS: {
          $avg: "$games_played.stats.PTS",
        },
        avg_AST: {
          $avg: "$games_played.stats.AST",
        },
        avg_REB: {
          $avg: "$games_played.stats.REB",
        },
        avg_DRB: {
          $avg: "$games_played.stats.DRB",
        },
        avg_ORB: {
          $avg: "$games_played.stats.ORB",
        },
        avg_TOV: {
          $avg: "$games_played.stats.TOV",
        },
        avg_STL: {
          $avg: "$games_played.stats.STL",
        },
        avg_BLK: {
          $avg: "$games_played.stats.BLK",
        },
        avg_GMSC: {
          $avg: "$games_played.stats.GMSC",
        },
        avg_PluMin: {
          $avg: "$games_played.stats.PluMin",
        },
      },
    },
  ];

  const aggCursor = await playersCollection.aggregate(careerAverage).toArray();
  res.send(aggCursor).status(200);
});

router.get("/:player/2022-2023", async (req, res) => {
  const gamesPlayed = [
    {
      $match: {
        name: `${req.params.player}`,
      },
    },
    {
      $unwind: "$games_played",
    },
    {
      $match: {
        "games_played.date": {
          $gte: "2022-10-18",
          $lte: "2023-06-12",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$games_played",
      },
    },
  ];
  const aggCursor = await playersCollection.aggregate(gamesPlayed).toArray();
  console.log(aggCursor);
  res.send(aggCursor).status(200);
});
// router.get("/:player", async (req, res) => {
//   let stats = await databases.playersDb.collection(`${req.params.player}`);
//   let results = await stats.find({}).toArray();
//   res.send(results).status(200);
// });

// router.get("/avg/", async (req, res) => {
//   const stats = databases.playersDb.collection("Klay Thompson");

//   const averagePoints = [
//     {
//       $group: {
//         _id: null,
//         averagePoints: {
//           $avg: "$PTS",
//         },
//       },
//     },
//   ];

//   const aggCursor = await stats.aggregate(averagePoints).toArray();
//   res.send(aggCursor).status(200);
// });

// router.get("/boxscores/", async (req, res) => {
//   try {
//     let boxscores = await databases.boxscoresDb.collection("all_boxscoress");

//     // Check if the boxscores collection is available
//     if (!boxscores) {
//       return res.status(500).send("Boxscores collection not found");
//     }

//     console.log("Collection found");
//     const gsw = [
//       {
//         $match: {
//           $or: [
//             {
//               home: "GSW",
//             },
//             {
//               visitor: "GSW",
//             },
//           ],
//         },
//       },
//     ];
//     const aggCursor = await boxscores.aggregate(gsw).toArray();
//     res.send(aggCursor).status(200);
//   } catch (err) {
//     console.error("Error fetching boxscores:", err);
//     res.status(500).send("Error fetching boxscores");
//   }
// });

export default router;
