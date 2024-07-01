const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        console.log("Logged in User ID:", loggedInUserId);

        // Find all users, including the logged-in user
        const users = await User.find().select("-password");
        
        console.log("All Users:", users);
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsers: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
