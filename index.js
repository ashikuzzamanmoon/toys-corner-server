const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // await client.connect();

    // gallery
    const toysGallery = client.db('toysGalleryDB').collection('toys')

    app.get('/toysGallery', async (req, res) => {
      const result = await toysGallery.find().toArray();
      res.send(result);
    })


    const database = client.db("toysDB");
    const toysCollection = database.collection("myToys");


    const index={toyName:1}
    const option={name:"toyIndex"}
    const result=toysCollection.createIndex(index,option)
    app.get('/toys/:text',async(req,res)=>{
      const text=req.params.text;
      const result=await toysCollection.find({
        $or:[
          {toyName:{$regex:text,$options:'i'}}
        ]
      }).toArray();
      res.send(result)
    })



    app.post('/addToys', async (req, res) => {
      const data = req.body;
      const result = await toysCollection.insertOne(data)
      res.send(result)
    })


    app.get('/addToys/:email', async (req, res) => {
      const email = req.params.email;
      const sort=req?.query?.sort===true?1:-1
      const result = await toysCollection.find({ email: email }).sort({price:sort}).toArray();
      res.send(result)
    })

    app.get('/addToys', async (req, res) => {
      const result = await toysCollection.find({}).limit(20).toArray();
      res.send(result)
    })

    app.get('/allToys/:text',async(req,res)=>{
      const text=req.params.text;
      const result=await toysCollection.find({subCategory:text}).toArray();
      res.send(result);
    })

    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query)
      res.send(result)
    })




    app.delete('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })

    app.patch('/mytoys/:id', async (req, res) => {
      const user = req.body;
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true}
      const updateUser = {
        $set: {
          price: user.price,
          quantity: user.quantity,
          description: user.description
        }
      }
      const result = await toysCollection.updateOne(filter, updateUser, options)
      res.send(result);
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