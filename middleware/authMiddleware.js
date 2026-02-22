const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
//middleware to verify token

const verifyToken = (req, res, next) => {

    //get token from headers authorization before reach the server
    const authHeader = req.headers.authorization;

    // check any header data store in authHeader or not . the
    //beacause header contains the jwt token 
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // extract the token from header '' is space remover ,  1 index is the token , 0s index is bearer
    const token = authHeader.split(' ')[1];
    // console.log("Token:", token);
    try {
        //verify the token with jwt secret key get the key to actual data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //decoded the data stored req.user to access in next middleware or controller
        req.user = decoded;
        console.log("Decoded User:", decoded);
        // allow or forward to next()
        next(); //
    } catch (error) {
        console.error("Token verification failed:", error.name, error.message);
        return res.status(401).json({ message: `Invalid token: ${error.message}` });
    }
};

module.exports = verifyToken;