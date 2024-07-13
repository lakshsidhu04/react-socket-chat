const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users: users });
    } catch (error) {
        console.error("Error in getUsers: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
        const {targetId, sourceId} = req.body;
        const sender = await User.findById(sourceId);
        const recipient = await User.findById(targetId);

        if (!recipient) {
            return res.status(404).json({ error: "User not found" });
        }

        if (recipient.requests.includes(sourceId)) {
            return res.status(400).json({ error: "Friend request already sent" });
        }

        recipient.requests.push(sourceId);
        await recipient.save();

        res.status(200).json({ status: "Friend request sent" });
    } catch (error) {
        console.error("Error in sendFriendRequest: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.receiveFriendRequest = async (req, res) => {
    try {
        const sourceId = req.body.sourceId;
        const targetId = req.body.targetId;

        const user = await User.findById(targetId);
        const sender = await User.findById(sourceId);

        if (!user || !sender) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.requests.includes(sender._id)) {
            return res.status(400).json({ error: "Friend request not found" });
        }

        user.friends.push(sender._id);
        user.requests = user.requests.filter(id => id.toString() !== sender._id.toString());
        sender.friends.push(user._id);

        await user.save();
        await sender.save();
        
        res.status(200).json({ status: "Friend request accepted" });
    } catch (error) {
        console.error("Error in receiveFriendRequest: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

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
};

exports.getPendingRequests = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const user = await User.findById(loggedInUserId).populate("requests", "-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ requests: user.requests });
    } catch (error) {
        console.error("Error in getPendingRequests: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.setProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const loggedInUserId = req.user._id;

        const user = await User.findById(loggedInUserId);
        user.profilePic = profilePic;
        await user.save();

        res.status(200).json({ status: "Profile picture updated" });
    } catch (error) {
        console.error("Error in setProfilePic: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.removeFriend = async (req, res) => {
    try {
        const targetId = req.body.targetId;
        const sourceId = req.body.sourceId;
        
        const user = await User.findById(sourceId);
        const friend = await User.findById(targetId);

        if (!user || !friend) {
            return res.status(404).json({ error: "User not found" });
        }

        user.friends = user.friends.filter(friendId => friendId.toString() !== targetId);
        friend.friends = friend.friends.filter(friendId => friendId.toString() !== sourceId);

        await user.save();
        await friend.save();

        res.status(200).json({ status: "Friend removed" });
    } catch (error) {
        console.error("Error in removeFriend: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
