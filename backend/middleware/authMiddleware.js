const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers["authorization"]; // Get the 'Authorization' header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token provided or incorrect format." });
    }

    // Extract the token part after 'Bearer'
    const token = authHeader.split(" ")[1];
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded token data (e.g., userId, role) to the request object
        next(); // Proceed to the next middleware or route handler

    
   
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
        //console.error("JWT Verification Error:", error.message); // Debugging step
        return res.status(401).json({ message: "Unauthorized access." });
    }
};

module.exports = verifyToken;