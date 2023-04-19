require('dotenv').config()
const express = require('express')
//const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const app = express()
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if(process.env.STATE === 'production') {
    app.use(cors())
} else {
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
    )
}
const db = require('./models')
const postRouter = require('./routes/Posts')
const commentRouter = require('./routes/Comments')
const userRouter = require('./routes/Users')
const likesRouter = require('./routes/Likes')
const RolesRouter = require('./routes/Roles')
if(process.env.STATE === 'production') {
    app.get('/backblog/', (req, res) => {
        res.set('Content-Type', 'text/html')
        res.send('Suis dans Blog')
    })
    app.use('/backblog/api/posts', postRouter)
    app.use('/backblog/api/comments', commentRouter)
    app.use('/backblog/api/auth', userRouter)
    app.use('/backblog/api/like', likesRouter)
    app.use('/backblog/api/roles', RolesRouter)
} else {
    app.use('/posts', postRouter)
    app.use('/comments', commentRouter)
    app.use('/auth', userRouter)
    app.use('/like', likesRouter)
    app.use('/roles', RolesRouter)
}
let PORT = process.env.PORT_DEV
let IP = ''

db.sequelize.sync()
    .then(() => {
        if(process.env.STATE === 'production') {
            PORT = process.env.PORT
            IP = process.env.IP
            app.listen(PORT, IP, () => {
                console.log(`Server runing on port ${PORT}`)
            })
        } else {
            app.listen(PORT, IP, () => {
                console.log(`Server runing on port ${PORT}`)
            })
        }
    })
    .catch((err) => {
        console.log('Failed to sync db: ' + err.message)
    })
