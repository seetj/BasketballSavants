import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const databaseConnection = async () => {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error(err);
  }

  const playersDb = client.db("Players");
  const boxscoresDb = client.db("BoxScores_2023");
  return { playersDb, boxscoresDb };
};

export default databaseConnection;

(async () => {
  try {
    // Call the databaseConnection function to get the databases
    const { playersDb, boxscoresDb } = await databaseConnection();

    // Test querying from the "Players" collection
    const playersCollection = playersDb.collection("Klay Thompson");
    const players = await playersCollection.find({}).limit(5).toArray();
    console.log("Sample players data:", players);

    // Test querying from the "BoxScores_2023" collection
    const boxscoresCollection = boxscoresDb.collection("all_boxscores");
    const boxscores = await boxscoresCollection.find({}).limit(5).toArray();
    console.log("Sample boxscores data:", boxscores);
  } catch (err) {
    console.error("Error during testing:", err);
  } finally {
    // Close the MongoDB client when done
    console.log("Connection closed.");
  }
})();
