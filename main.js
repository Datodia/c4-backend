const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const productRouter = require('./products/product.route')
const userRouter = require('./users/user.route')
const authRouter = require('./auth/auth.route')
const { upload } = require('./config/cloudinary')
const {sendEmail, sendWelcomeMessage} = require('./lib/mailer')
const app = express()

app.use(express.json())
app.use(cors())

app.use('/auth', authRouter)
app.use('/products', productRouter)
app.use('/users', userRouter)

app.post('/send-email', async (req, res) => {
    const {to, subject, text} = req.body
    // const users = [
    //     'kartvelishvilialeksi@gmail.com',
    //     'n.didebashvili21@gmail.com',
    //     'mindadzekato48@gmail.com',
    //     'lukanidzaradze@gmail.com',
    //     'giorgisanadiradze19@gmail.com'
    // ]
    // for(let i = 0; i < users.length; i++){
    // }
    await sendEmail({to, subject, text})
    res.send('sent successfully')
})

app.post('/send-html', async (req, res) => {
    const {to, subject, html} = req.body

    await sendWelcomeMessage({to, subject})
    res.send('sent successfully')
})

app.get('/', (req, res) => {
    res.send('hello world')
})


db().then(res => {
    app.listen(3000, () => {
        console.log('server running on http://localhost:3000')
    })
})

