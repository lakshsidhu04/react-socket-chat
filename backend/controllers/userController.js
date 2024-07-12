const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find().select("-password");
        res.status(200).json({users:users});
    } catch (error) {
        console.error("Error in getUsers: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const loggedInUserId = req.user._id;

        const user = await User.findById(loggedInUserId);
        const recipient = await User.findById(userId);

        if (!user || !recipient) {
            return res.status(404).json({ error: "User not found" });
        }

        if (recipient.requests.includes(loggedInUserId)) {
            return res.status(400).json({ error: "Friend request already sent" });
        }

        recipient.requests.push(loggedInUserId);
        await recipient.save();

        res.status(200).json({ status: "Friend request sent" });
    } catch (error) {
        console.error("Error in sendFriendRequest: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.receiveFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const loggedInUserId = req.user._id;

        const user = await User.findById(loggedInUserId);
        const sender = await User.findById(userId);

        if (!user || !sender) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.requests.includes(userId)) {
            return res.status(400).json({ error: "Friend request not found" });
        }

        user.friends.push(userId);
        user.requests = user.requests.filter(id => id.toString() !== userId);
        sender.friends.push(loggedInUserId);

        await user.save();
        await sender.save();

        res.status(200).json({ status: "Friend request accepted" });
    } catch (error) {
        console.error("Error in receiveFriendRequest: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getFriends = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const user = await User.findById(loggedInUserId).populate("friends", "-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getFriends: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
