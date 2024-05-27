const express = require ( 'express');
const routes  = require ('./src/routes/routes');

//import config from './config/constants';
const bodyParser = require ('body-parser');
const db = require('./src/db/models');

const flash = require('connect-flash');
const expressSession = require('express-session');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

dotenv.config( { path : './config.env'} )
const PORT = process.env.PORT || 3000

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const os = require('os');
//const YAML = require('yamljs'); // หรือใช้ไลบรารี JSON หากไฟล์ Swagger Specification เป็น JSON

//const swaggerDocument = YAML.load('src/swagger.yaml'); // ระบุพาธไปยังไฟล์ Swagger Specification ของคุณ

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// กำหนด middleware โดยใช้ Path Pattern
// ทุก request จะต้องมี path ที่ขึ้นต้นด้วย ค่าที่เรา config ไว้ในไฟล์ constants
app.use(bodyParser.json());

// view engine setup
const viewpath = path.join(__dirname , 'views');
app.set('views', viewpath);
app.set('view engine', 'ejs');
//console.log(viewpath);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(flash())

app.use(expressSession({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
/*app.use(expressSession({
  secret: "node secret"
}))
global.loggedIn = null
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId
  next()
})*/

app.use('/api', routes);
app.use('/', routes);
app.use('/register', routes);
app.use('/login', routes);
app.use('/home', routes);
app.use('/logout', routes);
app.use('/user/me', routes);
app.use('/post', routes);
app.use('/admin', routes);

/*db.sequelize.sync().then(() => {
  server.listen(PORT), () => {
    console.log(`
    Title : Project1
    Port: ${PORT}
    Env: ${app.get('env')}
    Server is running on port ${port}
  `);
  }});*/

const networkInterfaces = os.networkInterfaces();

let ipAddress;

Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
        if (!iface.internal && iface.family === 'IPv4') {
            ipAddress = iface.address;
        }
    });
});

console.log(ipAddress);

server.listen(PORT, () => {
  console.log(`
  Title : Project1
  Port: ${PORT}
  Env: ${app.get('env')}
  Server is running on http://${ipAddress}:${PORT}
`);
});

// db.sequelize.authenticate()
//   .then(() => {
//     console.log('เชื่อมต่อกับฐานข้อมูล MySQL สำเร็จ');
//   })
//   .catch(err => {
//     console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล MySQL:', err);
//   });


io.on('connection', (socket) => {
  console.log('Client connected');
  let interval;

  if (typeof global.myValue !== 'undefined') {
    interval = setInterval(() => {
      io.emit('serialData', global.myValue);
    }, 5000);
}
  socket.on('disconnect', () => {
    if (typeof global.myValue !== 'undefined') {
    clearInterval(interval);
    global.myValue = null;
    };
    socket.disconnect();
    console.log('Client disconnected');
  });
});


