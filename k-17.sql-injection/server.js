import express from "express";
import DB from "better-sqlite3";
import path from "path";

const db = new DB(":memory:");

db.exec(`
    CREATE TABLE users (
      id       INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role     TEXT NOT NULL DEFAULT 'user'
    );
   
    INSERT INTO users VALUES
      (1, 'alice',  'hunter2',    'user'),
      (2, 'bob',    'password123','user'),
      (3, 'admin',  'supersecret','admin');
  `);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login/unsafe", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  let result;
  try {
    result = db.prepare(query).get();
  } catch (error) {
    return res.json({ ok: false, error: error.message });
  }

  if (result) {
    return res.json({ ok: true, user: result });
  }

  return res.json({ ok: false, error: "Invalid creds" });
});

app.post("/login/safe", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  let result;
  try {
    result = db.prepare(query).get(username, password);
  } catch (error) {
    return res.json({ ok: false, error: error.message });
  }

  if (result) {
    return res.json({ ok: true, user: result });
  }

  return res.json({ ok: false, error: "Invalid creds" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
