require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const dataCollection = client
      .db("Jewelry")
      .collection("dataCollection");
    const addToCartCollection = client
      .db("Jewelry")
      .collection("carts");

      // get data
    app.get("/products", async (req, res) => {
      try {
        const result = await dataCollection.find().toArray();
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    });
    
    //! delete data

    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await dataCollection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
      }
    });

    // post api
    app.post('/products/addCart',async(req,res)=>{
      const body = req.body;
      // console.log(body)
      const result = await addToCartCollection.insertOne(body);
      res.send(result)
      
    })
     
    app.get('/item',async(req,res)=>{
      try {
        const result = await addToCartCollection.find().toArray();
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    })
    app.delete('/item/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addToCartCollection.deleteOne(query)
      res.send(result)
    })


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

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
