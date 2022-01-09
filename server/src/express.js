const express = require("express");
import Template from "../template";
const cors = require("cors");
import router from "./router";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", router);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).send(Template());
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  }
});

export default app;
