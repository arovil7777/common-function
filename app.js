// API
const http = require('http');
const https = require('https');
const express = require('express');
const { readFileSync } = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

const config = require(process.cwd() + './config/config.json')[server];
const { httpPort, httpsPort } = config;

// Swagger
const { serve, setup } = require('swagger-ui-express');
const swaggerOption = require('./swagger/swaggerSetting');

// DB 및 Router
var models = require('./models');
var accountRouter = require('./routes/accountRoute');
var levelRouter = require('./routes/levelRoute');
var authRouter = require('./routes/authorizationRoute');

// const sequelize = models.sequelize;
const app = express();

models.sequelize.sync()
    .then(() => {
        console.log('DB connection success.');
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });

const privateKey = readFileSync('./ssl/private.pem'); // 개인키
const certificate = readFileSync('./ssl/public.pem'); // 공개키

const options = {
    key: privateKey,
    cert: certificate,
    etag: false
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    key: 'sessionID',
    secret: '비밀',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24000 * 60 * 60
    }
}));
app.use(cors());
app.use('/swagger', serve, setup(swaggerOption, { explorer: true }));

// app.use('/', function (req, res) {
//     express.static(__dirname + './public', options);
//     res.end();
// });
// app.use('/', express.static('./public'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Locale');
    res.header('Access-Control-Expose-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Locale');
    (req.method == 'OPTIONS') ? res.sendStatus(200) : next();
    // res.header('Access-Control-Allow-Headers', 'Content-Type');
});

httpServer.listen(httpPort, function () {
    console.log(`Server is running at : http://localhost:${httpPort}`);
});

httpsServer.listen(httpsPort, function () {
    console.log(`HTTPS server listening on port ${httpsPort}`);
});

// 사용자 계정 관리
app.use('/api/accounts', accountRouter);
// 사용자 등급 관리
app.use('/api/levels', levelRouter);
// 사용자 인증 관리
app.use('/api/users', authRouter);