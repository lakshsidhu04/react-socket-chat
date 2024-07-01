const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protectRoute = async (req, res, next) => {
    try {
        console.log(req.cookies.jwt);
        const token = req.cookies.jwt;
        
        if (!token) {
            console.log("No Token");
            return res.status(401).json({ error: "No Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { protectRoute };
