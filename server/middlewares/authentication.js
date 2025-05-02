const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models')

const authentication = async (req, res, next) => {
    const bearerToken = req.headers.authorization
    if (!bearerToken) {
        return res.status(401).json({ message: "Invalid token" })
    }
    const access_token = bearerToken.split(' ')[1]
    try {
        const data = verifyToken(access_token)
        const user = await User.findByPk(data.id)
        if (!user) {
            return res.status(401).json({ message: "Invalid token" })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = authentication;