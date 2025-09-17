import express from 'express'
import dotenv from 'dotenv'
import { loginUser, otpLogin } from './api/login.js'

dotenv.config()

const app = express()
const port = 3000

app.use(express.static('./frontend/dist'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login-user', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email and password required' });
    }

    const result = await loginUser(email, password);

    if (result.success) {
        res.json({
            message: 'User logged in successfully!',
            user: result.user
        });
    } else {
        res.status(401).json({ message: result.message });
    }
})

app.post('/login-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'email is required' });
    }

    const result = await otpLogin(email);

    if (result.success) {
        res.json({
            message: 'OTP generated successfully!',
            user: result.otp
        });
    } else {
        res.status(401).json({ message: result.message });
    }
})

app.listen(port, () => {
    console.log(`Restaurant app listening on port ${port}`)
})
