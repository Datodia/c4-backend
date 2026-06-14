const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    otpCode: {
        type: String,
        select: false
    },
    otpCodeExpirationDate: {
        type: Date,
        select: false
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'products',
        default: []
    }
})

module.exports = mongoose.model('user', userSchema)