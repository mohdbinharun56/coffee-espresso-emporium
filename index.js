const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// MongoDB connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.b1v1s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const db = client.db('espressoCoffee');
        const coffeeCollection = db.collection('coffees');

        // get all Coffees
       app.get('/coffee',async(req,res)=>{
        const cursor = coffeeCollection.find();
        const coffee = await cursor.toArray();
        res.send(coffee);
       })

        // get a specific coffee
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await coffeeCollection.findOne(query);
            res.send(result);

        })

        // add single coffee
        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            const addCoffee = {
                name: coffee.name,
                chef: coffee.chef,
                supplier: coffee.supplier,
                taste: coffee.taste,
                category: coffee.category,
                details: coffee.details,
                photo: coffee.photo,
            }

            const result = await coffeeCollection.insertOne(addCoffee);
            console.log(result);
            res.send(result);
        })

        // update existing coffee
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const coffee = req.body;

            const filter = { _id: new ObjectId(id) }
            const updateCoffee = {
                $set: {
                    name: coffee.name,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    photo: coffee.photo,
                }
            }
            const result = await coffeeCollection.updateOne(filter,updateCoffee);
            res.send(result);
        })


        // delete an existing coffee
        app.delete('/coffee/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(filter);
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
    res.send('Application get');
})

app.listen(port, () => {
    console.log(`Application run port: ${port}`)
})