const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_DESTINATION_IS_MY_SECRET_KEY";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD || "Admin@1234",
  10
);

let client = null;

async function getClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("✅ Admin Database Client Connected");
  }
  return client;
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function serializeDoc(doc) {
  if (!doc) return doc;
  const result = {};
  for (const [key, value] of Object.entries(doc)) {
    if (value instanceof ObjectId) result[key] = value.toString();
    else if (Array.isArray(value)) result[key] = value.map(v => v instanceof ObjectId ? v.toString() : v);
    else if (value && typeof value === "object" && !(value instanceof Date) && value.constructor === Object) result[key] = serializeDoc(value);
    else result[key] = value;
  }
  return result;
}

// AUTH
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });
  if (username !== ADMIN_USERNAME)
    return res.status(401).json({ error: "Invalid credentials" });
  
  const valid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  
  const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, username, message: "Login successful" });
});

router.get("/auth/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// DATABASES
router.get("/databases", authMiddleware, async (req, res) => {
  try {
    const mongoClient = await getClient();
    const adminDb = mongoClient.db("admin");
    const result = await adminDb.command({ listDatabases: 1 });
    res.json({ databases: result.databases.map(d => ({ name: d.name, sizeOnDisk: d.sizeOnDisk })) });
  } catch (err) {
    const dbName = new URL(MONGODB_URI).pathname.replace("/", "") || "TourTravels1";
    res.json({ databases: [{ name: dbName, sizeOnDisk: 0 }] });
  }
});

// COLLECTIONS
router.get("/collections/:dbName", authMiddleware, async (req, res) => {
  try {
    const mongoClient = await getClient();
    const targetDb = mongoClient.db(req.params.dbName);
    const collections = await targetDb.listCollections().toArray();
    const withCounts = await Promise.all(
      collections.map(async col => ({
        name: col.name,
        count: await targetDb.collection(col.name).countDocuments(),
      }))
    );
    res.json({ collections: withCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET DOCUMENTS
router.get("/data/:dbName/:collectionName", authMiddleware, async (req, res) => {
  try {
    const { dbName, collectionName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    
    const mongoClient = await getClient();
    const collection = mongoClient.db(dbName).collection(collectionName);

    let query = {};
    if (search) {
      const sample = await collection.findOne();
      if (sample) {
        const stringKeys = Object.keys(sample).filter(k => typeof sample[k] === "string" && k !== "_id");
        if (stringKeys.length > 0) {
          query = { $or: stringKeys.map(k => ({ [k]: { $regex: search, $options: "i" } })) };
        }
      }
    }

    const [documents, total] = await Promise.all([
      collection.find(query).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query),
    ]);

    res.json({
      documents: documents.map(serializeDoc),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE
router.get("/data/:dbName/:collectionName/:id", authMiddleware, async (req, res) => {
  try {
    const { dbName, collectionName, id } = req.params;
    const mongoClient = await getClient();
    const doc = await mongoClient.db(dbName).collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json({ document: serializeDoc(doc) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/data/:dbName/:collectionName", authMiddleware, async (req, res) => {
  try {
    const { dbName, collectionName } = req.params;
    const docToInsert = { ...req.body };
    delete docToInsert._id;
    const mongoClient = await getClient();
    const result = await mongoClient.db(dbName).collection(collectionName).insertOne(docToInsert);
    res.status(201).json({ message: "Document created", insertedId: result.insertedId.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/data/:dbName/:collectionName/:id", authMiddleware, async (req, res) => {
  try {
    const { dbName, collectionName, id } = req.params;
    const update = { ...req.body };
    delete update._id;
    const mongoClient = await getClient();
    const result = await mongoClient.db(dbName).collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Document not found" });
    res.json({ message: "Document updated", modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ONE
router.delete("/data/:dbName/:collectionName/:id", authMiddleware, async (req, res) => {
  try {
    const { dbName, collectionName, id } = req.params;
    const mongoClient = await getClient();
    const result = await mongoClient.db(dbName).collection(collectionName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Document not found" });
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BULK DELETE
router.delete("/data/:dbName/:collectionName", authMiddleware, async (req, res) => {
  try {
    const { dbName, collectionName } = req.params;
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "ids array required" });
    const mongoClient = await getClient();
    const result = await mongoClient.db(dbName).collection(collectionName).deleteMany({
      _id: { $in: ids.map(id => new ObjectId(id)) },
    });
    res.json({ message: `Deleted ${result.deletedCount} documents` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STATS
router.get("/stats/:dbName/:collectionName", authMiddleware, async (req, res) => {
  try {
    const { dbName, collectionName } = req.params;
    const mongoClient = await getClient();
    const stats = await mongoClient.db(dbName).command({ collStats: collectionName });
    res.json({ count: stats.count, size: stats.size, avgObjSize: stats.avgObjSize, storageSize: stats.storageSize, nindexes: stats.nindexes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
