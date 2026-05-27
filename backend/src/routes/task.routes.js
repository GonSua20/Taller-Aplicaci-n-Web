const express = require("express");
const TaskController = require("../controllers/task.controller");

const taskController = new TaskController();
const router = express.Router();

router.get("/", taskController.findAll);
router.get("/:id", taskController.findById);
router.post("/", taskController.create);
router.patch("/:id", taskController.update);
router.delete("/:id", taskController.delete);

module.exports = router;