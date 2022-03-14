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


// try {
//   db.sequelize.sync({ alter: true,force: true }).then(() => {
//     console.log("Drop and re-sync db.");
//   }).catch(err =>{
//     console.log(err);
//   });

// }catch(err) {
//   console.log("some this wrong happen in sequelize");

// }





app.use(errorHandler);
app.listen(APP_PORT,()=>console.log(`listening on port ${APP_PORT}`));

