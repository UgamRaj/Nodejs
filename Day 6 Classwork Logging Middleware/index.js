import express from "express";
import morgan from "morgan";
import { logginMiddleware } from "./middlewares.js";

const app = express();

const PORT = 3000;

app.use(morgan("dev"));

app.get("/query", logginMiddleware, (req, res) => {
  const queries = req.query;
  console.log(queries);
  //   console.log("Request recieved");
  console.log("Ugam Raj");
  res.send("This is response");
  // res.json(queries);
});

// app.get("/path/:key1/:key2", (req, res) => {
//   const params = req.params;
//   const queries = req.query;
//   res.send(`key 1 is ${params.key1} and `);
// });

app.listen(PORT, () => {
  console.log("Server has started");
});
