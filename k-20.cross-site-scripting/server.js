import express from "express";
import { readFileSync } from "fs";

const app = express();
app.use(express.json());

const comments = [];

app.get("/", (_req, res) => {
  res.send(readFileSync("./index.html", "utf-8"));
});

app.get("/comments", (_req, res) => {
  res.json(comments);
});

app.post("/comment", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ ok: false });
  console.log(text)
  comments.push(text);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("App on http://localhost:3000"));