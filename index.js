import express from 'express'
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const app = express()
const port = 8000

const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
 const mongoClient = await connectToMongoDB()
 const db = mongoClient.db("studior")
 const studiosCollection = db.collection("studios")

app.get('/studios', async(req, res) => {
    const result = await studiosCollection.find().toArray()
  res.send(result)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})