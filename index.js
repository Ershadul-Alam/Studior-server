import express from 'express';
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = 8000;
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: process.env.BASE_URI,
    credentials: true
}));


const client = new MongoClient(process.env.MONGODB_URI);
let studiosCollection;

async function startServer() {
    try {
        // 1. Connect to MongoDB first
        await client.connect();
        console.log("You successfully connected to MongoDB!");

        const db = client.db("studior");
        studiosCollection = db.collection("studios");

        // 2. Start the Express server ONLY if DB connection succeeds
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1); // Exit if we can't connect to the DB
    }
}



// Routes
app.get('/studios', async (req, res) => {
    const result = await studiosCollection.find().toArray();
    res.send(result);
});

app.get('/studios/:id', async (req, res) => {
    const { id } = req.params;
    const result = await studiosCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
});

app.delete('/your-studio/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid studio ID format." });
        }

        const result = await studiosCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Studio not found or already deleted." });
        }

        return res.status(200).json({ message: "Studio deleted successfully." });

    } catch (error) {
        console.error("[DELETE /your-studio/:id] Error:", error);

        return res.status(500).json({ error: "Failed to delete the studio due to a server error." });
    }
});

app.post('/add-studio', async (req, res) => {
    const newStudio = req.body;
    const result = await studiosCollection.insertOne(newStudio);
    res.status(201).send(result);
});

// Initialize everything
startServer();