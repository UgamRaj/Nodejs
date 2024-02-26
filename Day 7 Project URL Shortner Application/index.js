import express from "express";
import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "node:url";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! Checking url is valid or not
const isURLValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// app.use(express.json());
//! parse incoming request bodies.
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Request received on /");
  res.sendFile(__dirname + "/index.html");
});

// console.log(
//   new URL("https://www.notion.so/Node-Notes-31d0e64032d84be9a21c42431d775c6a")
// );
app.post("/url-shortner", (req, res) => {
  const longUrl = req.body.longUrl;
  //   console.log("🚀 ~ app.post ~ longUrl:", longUrl);

  const shortUrl = nanoid(9);
  const isValid = isURLValid(longUrl);
  //   console.log("🚀 ~ app.post ~ isValid:", isValid);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL",
    });
  }
  const fileResponse = fs.readFileSync("urlDatabase.json");
  const fileData = JSON.parse(fileResponse.toString());

  fileData[shortUrl] = longUrl;

  fs.writeFileSync("urlDatabase.json", JSON.stringify(fileData));

  res.json({
    succes: true,
    url: `http://localhost:3000/${shortUrl}`,
  });
});

//! When a user accesses a short URL, the server checks the urlDatabase.json and redirects to the original long URL if found.
app.get("/:shortUrl", (req, res) => {
  const fileResponse = fs.readFileSync("urlDatabase.json");
  const fileData = JSON.parse(fileResponse.toString());
  const longUrl = fileData[req.params.shortUrl];
  // If longurl doesn't exists show 404 with json
  res.redirect(longUrl);
});

//todo---> Server Start:
app.listen(PORT, () =>
  console.log(`Spp is running on http://localhost:${PORT}`)
);
