require('dotenv').config()
const express = require("express")
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hncbqqn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const earNoseCollection = client.db("Jewelry").collection("earNose");
    const featuresCollection = client.db("Jewelry").collection("features");

    app.get("/earNose", async (req, res) => {
      try {
        const result = await earNoseCollection.find().toArray();
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    });
    app.get("/features", async (req, res) => {
      try {
        const result = await featuresCollection.find().toArray();
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.use(express.json())
app.use(cors());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});