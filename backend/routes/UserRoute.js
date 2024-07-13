const express = require("express");
const { getUsers, sendFriendRequest, receiveFriendRequest, getFriends, getPendingRequests, setProfilePic } = require("../controllers/userController");
const { protectRoute } = require("../middleware/protectRoute");

const router = express.Router();

router.get("/", protectRoute, getUsers);
router.post("/friend-request", protectRoute, sendFriendRequest);
router.post("/accept-friend-request", protectRoute, receiveFriendRequest);
router.get("/friends", protectRoute, getFriends);
router.get("/pending-requests", protectRoute, getPendingRequests); 
router.post('/profile-pic', protectRoute, setProfilePic);
module.exports = router;
