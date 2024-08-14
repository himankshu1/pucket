import express from "express";
import "dotenv/config";
import connectToDB from "./utils/connectToDB.js";

const app = express();

const PORT = process.env.PORT;

// database connectivity
await connectToDB();

app.get("/", (req, res) => {
  res.json({ message: "working", status: "ok" });
});

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
