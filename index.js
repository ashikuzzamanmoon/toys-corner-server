const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjtbp3d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // gallery
    const toysGallery = client.db('toysGalleryDB').collection('toys')
    
    app.get('/toysGallery', async(req, res) => {
        const result = await toysGallery.find().toArray();
        res.send(result);
    })

    const database = client.db("toysDB");
    const toysCollection= database.collection("myToys");


    app.post('/addToys',async(req,res)=>{
        const data=req.body;
          const result=await toysCollection.insertOne(data)
          res.send(result)
    })


    app.get('/addToys/:email',async(req,res)=>{
        
    })

    app.get('/addToys',async(req,res)=>{
        const result=await toysCollection.find().toArray();
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Toys Server')
})

app.listen(port, () => {
    console.log(`Toy Server is running on port ${5000}`);
})