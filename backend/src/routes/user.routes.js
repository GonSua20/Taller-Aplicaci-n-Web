const express = require("express");
const UserController = require("../controllers/user.controller");

const userController = new UserController();
const router = express.Router();

router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.post("/", userController.create);
router.patch("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router;