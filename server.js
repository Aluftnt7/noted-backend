const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const roomRoutes = require('./api/room/room.routes')

const connectSockets = require('./api/Socket/SocketRoutes')


app.use(cookieParser())
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(express.static(path.resolve(__dirname, 'public')));
if (process.env.NODE_ENV === 'production') {

} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:3030', 'http://localhost:3030'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/room', roomRoutes)
connectSockets(io)


const logger = require('./services/LoggerService')
const port = process.env.PORT || 3030;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
});