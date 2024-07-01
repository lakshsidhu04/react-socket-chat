const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protectRoute } = require("../middleware/protectRoute");


const router = express.Router();

router.get("/", protectRoute, getUsers);

module.exports = router;