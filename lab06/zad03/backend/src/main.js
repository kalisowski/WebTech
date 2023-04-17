// express hello world

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Model to store counter
const Counter = mongoose.model("Counter", { count: Number }, "counters");

// Connect to MongoDB
await mongoose.connect(
  `mongodb://${process.env.MONGODB_HOST || "localhost"}:${
    process.env.MONGODB_PORT || 27017
  }/lab6`
);

// create initial counter if not exists
{
  const counter = await Counter.findOne();
  if (!counter) {
    const counter = new Counter({ count: 0 });
    await counter.save();
  }
}

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let count = 0;

app.get("/count", async (req, res) => {
  //   res.json({ count });
  const counter = await Counter.findOne();
  res.json({ count: counter.count });
});

app.post("/count", express.json(), async (req, res) => {
  //   count = req.body.count;
  //   res.json({ count });
  const counter = await Counter.findOne();
  counter.count = req.body.count;
  await counter.save();
  res.json({ count: counter.count });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
