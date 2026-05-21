const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../src/models/blacklist.model")

async function authUser(req , res , next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message : "Token not provided"
        })
    }

    const isTokenBlacklisted = await tokenBlackListModel.findOne({token})

    if(isTokenBlacklisted){
        return res.status(401).json({
            message : "Token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message : "Token is invalid"
        })
    }
}

module.exports = {
    authUser
}