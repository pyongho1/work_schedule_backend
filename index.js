const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// Parse the JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com",
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

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

module.exports = app; // Ensure to export the app for Vercel
