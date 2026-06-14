const { Router } = require("express");
const validateMiddleware = require("../middlewares/validate.middleware");
const userModel = require("../users/user.model");
const bcrypt = require('bcrypt');
const signInUserSchema = require("./dto/sign-in.dto");
const jwt = require('jsonwebtoken');
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const signUpUserSchema = require("./dto/sign-up.dto");
const verifyUserSchema = require("./dto/verify-user.dto");
const { sendOtpCode } = require("../lib/mailer");

const authRouter = new Router()

const OTP_TTL_MS = 3 * 60 * 1000 // 3 minutes

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000))

authRouter.post('/sign-up', validateMiddleware(signUpUserSchema), async (req, res) => {
    const {fullName, email, password} = req.body

    const existUser = await userModel.findOne({email})
    if(existUser){
        return res.status(400).json({message: "User Already exists"})
    }

    const hashedPass = await bcrypt.hash(password, 10)
    const otpCode = generateOtp()
    const otpCodeExpirationDate = new Date(Date.now() + OTP_TTL_MS)

    const newUser = await userModel.create({
        fullName,
        password: hashedPass,
        email,
        verified: false,
        otpCode,
        otpCodeExpirationDate
    })

    await sendOtpCode({ to: email, otp: otpCode })

    res.status(201).json({message: "user registered successfully, verify with OTP code sent to your email"})

})

authRouter.post('/verify-user', validateMiddleware(verifyUserSchema), async (req, res) => {
    const {email, otp} = req.body

    const user = await userModel.findOne({email}).select('+otpCode +otpCodeExpirationDate')
    if(!user){
        return res.status(400).json({message: "user not found"})
    }

    if(user.verified){
        return res.status(400).json({message: "user already verified"})
    }

    if(!user.otpCode || user.otpCode !== otp){
        return res.status(400).json({message: "invalid OTP code"})
    }

    if(user.otpCodeExpirationDate < new Date()){
        return res.status(400).json({message: "OTP code expired"})
    }

    user.verified = true
    user.otpCode = undefined
    user.otpCodeExpirationDate = undefined
    await user.save()

    res.status(200).json({message: "user verified successfully"})
})

authRouter.post('/sign-in', validateMiddleware(signInUserSchema), async (req, res) => {
    const {email, password} = req.body

    const existUser = await userModel.findOne({email}).select('+password')
    if(!existUser) {
        return res.status(400).json({message: "email or password is invalid"})
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password)
    if(!isPassEqual){
        return res.status(400).json({message: "email or password is invalid"})
    }

    if(!existUser.verified){
        return res.status(403).json({message: "please verify your email first"})
    }

    const payload = {
        userId: existUser._id
    }

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})

    res.status(200).json({token})
})

authRouter.get('/current-user', isAuthMiddleware, async (req, res) => {
    const user = await userModel.findById(req.userId)

    res.json(user)
})

module.exports = authRouter