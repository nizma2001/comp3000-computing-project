//Middleware to check the role of users and their privileges

const authorizeRole = (requiredRole) => {
    return (req, res, next) => {

        if (!req.user || (req.user.role !== requiredRole && req.user.role !== "admin")) {
            return res.status(403).json({ message: "Access denied." });
        }
        next(); // Proceed to the next middleware or route handler for users or admin
    };
};

module.exports = authorizeRole;