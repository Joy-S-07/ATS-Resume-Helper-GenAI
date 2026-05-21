const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"]
    }
}, 
{
    timestamps: true
})

const tokenBlackListModel = mongoose.model("blacklistTokens", blacklistSchema)

module.exports = tokenBlackListModel

