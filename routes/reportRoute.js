import express from 'express';
import {reportController} from '../controllers';
import auth from '../middlewares/auth';
const reportRoute = express.Router();

//productRouter.get('/all',productController.getAll);
reportRoute.get('/inventory/:id',reportController.myInventory);
reportRoute.get('/alldistribution',reportController.AllDistribution);

export default reportRoute;