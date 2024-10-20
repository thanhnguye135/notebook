const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from backend......");
});

app.listen(8386, () => {
  console.log("Backend is running on port 8386......");
});
