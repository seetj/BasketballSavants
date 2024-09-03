const db = client.db("aggregation");
const coll = db.collection("Klay Thompson");

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

const aggCursor = coll.aggregate(averagePoints);

for await (const doc of aggCursor) {
  console.log(doc);
}
