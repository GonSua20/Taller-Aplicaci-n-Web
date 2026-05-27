const express = require("express");
const taskRoutes = require("./task.routes");
const userRoutes = require("./user.routes");

function routerApi(app) {
  const router = express.Router();
  app.use("/api", router);
  router.use("/tasks", taskRoutes);
  router.use("/users", userRoutes);
}

module.exports = routerApi;