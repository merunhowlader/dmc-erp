import express from 'express';
import {reportController} from '../controllers';
import auth from '../middlewares/auth';
const reportRoute = express.Router();

//productRouter.get('/all',productController.getAll);

reportRoute.get('/operations',reportController.stockOperation);
reportRoute.get('/operation/:id',reportController.viewSingleOperation);
reportRoute.get('/inventory/:id',reportController.Inventory);
reportRoute.get('/alldistribution',reportController.AllDistribution);

//non admin
reportRoute.get('/mydemand',reportController.viewMyAllReleted);
reportRoute.get('/myoperations',reportController.myStockOperation);

export default reportRoute;