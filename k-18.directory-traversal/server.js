import express from "express";
import path from "path";
import fs from "fs";

const DIR = path.resolve("./files");

const app = express();

app.get("/file/unsafe", (req, res) => {
  const filePath = path.join(DIR, req.query.name);

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return res.json({ ok: true, content });
  } catch (error) {
    return res.json({ ok: false, error: error.message });
  }
});

app.get("/file/safe", (req, res) => {
  const filePath = path.resolve(DIR, req.query.name);

  if (!filePath.startsWith(DIR + path.sep)) {
    return res.json({ ok: false, error: "Access denied" });
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return res.json({ ok: true, content});
  } catch (error) {
    return res.json({ ok: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
