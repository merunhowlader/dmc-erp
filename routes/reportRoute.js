import express from 'express';
import {reportController} from '../controllers';
import auth from '../middlewares/auth';
const reportRoute = express.Router();

//productRouter.get('/all',productController.getAll);

reportRoute.get('/operations',reportController.stockOperation);
reportRoute.get('/operation/:id',reportController.viewSingleOperation);
reportRoute.get('/inventory/:id',reportController.myInventory);
reportRoute.get('/alldistribution',reportController.AllDistribution);

export default reportRoute;