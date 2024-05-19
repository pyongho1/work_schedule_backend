const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// Parse the JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com",
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;

app.post("/add-schedule", async (req, res) => {
  const { employeeName, schedule, group } = req.body;
  try {
    await db.collection("schedules").add({
      employeeName,
      schedule,
      group,
    });
    res.status(200).send("Schedule added");
  } catch (error) {
    res.status(500).send("Error adding schedule");
  }
});

app.get("/get-schedules", async (req, res) => {
  const group = req.query.group;
  try {
    const schedulesSnapshot = await db
      .collection("schedules")
      .where("group", "==", group)
      .get();
    const schedules = [];
    schedulesSnapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(schedules);
  } catch (error) {
    res.status(500).send("Error getting schedules");
  }
});

app.get("/get-employees", async (req, res) => {
  const group = req.query.group;
  try {
    const employeesSnapshot = await db
      .collection("users")
      .where("group", "==", group)
      .get();
    const employees = [];
    employeesSnapshot.forEach((doc) => {
      employees.push({ uid: doc.id, ...doc.data() });
    });
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send("Error getting employees");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
