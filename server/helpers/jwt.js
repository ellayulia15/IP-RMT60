const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY;

if (!SECRET) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
}

const signToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

module.exports = {
    signToken,
    verifyToken
};
