import express from "express";
import { APP_PORT } from "./config";
import errorHandler from './middlewares/errorHandler';
//var cors = require('cors')
import cors from "cors";
import routes from "./routes";

// const db = require("./models");



const app = express();


app.use(express.json());


// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


const corsOpts = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: [
    'GET',
    'POST',
    'PUT',
  ],

};

app.use(cors(corsOpts));
app.use('/api/v1/',routes);





app.post('/send-notification', (req, res) => {
  const notify = {data: req.body};
  socket.emit('notification', notify); // Updates Live Notification
  res.send(notify);
});


app.use(errorHandler);
// Send Notification API
app.post('/send', (req, res) => {
  const notify = {data: req.body};
  socket.emit('merun', notify);
  // Updates Live Notification
  res.send(notify);
});


const server =app.listen(APP_PORT,()=>console.log(`listening on port ${APP_PORT}`));


// Socket Layer over Http Server
const socket = require('socket.io')(server);
global.socket = socket;
// On every Client Connection
socket.on('connection', socket => {
    
});