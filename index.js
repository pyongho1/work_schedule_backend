const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Update this path if necessary

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com",
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;

// Endpoint to add schedule
app.post("/add-schedule", async (req, res) => {
  const { employeeName, schedule } = req.body;
  try {
    await db.collection("schedules").add({
      employeeName,
      schedule,
    });
    res.status(200).send("Schedule added");
  } catch (error) {
    res.status(500).send("Error adding schedule");
  }
});

// Endpoint to get schedules
app.get("/get-schedules", async (req, res) => {
  try {
    const schedulesSnapshot = await db.collection("schedules").get();
    const schedules = [];
    schedulesSnapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(schedules);
  } catch (error) {
    res.status(500).send("Error getting schedules");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
