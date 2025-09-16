import express from 'express'
import dotenv from 'dotenv'
import { loginUser } from './api/login.js'

dotenv.config()

const app = express()
const port = 3000

app.use(express.static('./frontend/dist'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Restaurant app listening on port ${port}`)
})
