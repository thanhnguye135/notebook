const express = require("express");
const { createClient } = require("redis");
const mysql = require("mysql2");
const app = express();

app.use(express.json());

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});

redisClient
  .connect()
  .then(() => console.log("CONNECTED TO REDIS"))
  .catch((err) => console.error("Redis connection error: ", err));

console.log(process.env.MYSQL_TCP_PORT);

// const mysqlConnection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   port: process.env.MYSQL_TCP_PORT,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });

// mysqlConnection.on("connect", () => {
//   console.log("CONNECTED TO MYSQL");
// });

// mysqlConnection.on("error", (error) => {
//   console.log("Mysql connection error", error);
// });

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_TCP_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
  } else {
    console.log("Connected to MySQL with connection pool");
    connection.release();
  }
});

app.post("/set", async (req, res) => {
  const { key, value } = req.query;
  try {
    await redisClient.set(key, value);
    res.json({ message: "Set key successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/get/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const value = await redisClient.get(key);
    res.json({ keyValue: value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from backend......");
});

app.listen(8386, () => {
  console.log("Backend is running on port 8386......");
});
