const express = require("express");

const app = express();

app.get("/", (_req, res) => {
  res.json({
    service: "github-actions-apprunner-cicd",
    status: "ok"
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ healthy: true });
});

module.exports = { app };
