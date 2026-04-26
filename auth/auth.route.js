const { Router } = require("express");
const validateMiddleware = require("../middlewares/validate.middleware");
const userModel = require("../users/user.model");
const bcrypt = require('bcrypt');
const signInUserSchema = require("./dto/sign-in.dto");
const jwt = require('jsonwebtoken');
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const signUpUserSchema = require("./dto/sign-up.dto");

const authRouter = new Router()

authRouter.post('/sign-up', validateMiddleware(signUpUserSchema), async (req, res) => {
    const {fullName, email, password} = req.body

    const existUser = await userModel.findOne({email})
    if(existUser){
        return res.status(400).json({message: "User Already exists"})
    }

    const hashedPass = await bcrypt.hash(password, 10)
    const newUser = await userModel.create({
        fullName,
        password: hashedPass,
        email
    })

    res.status(201).json({message: "user registered successfully"})

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