import express from 'express';
import {reportController} from '../controllers';
import auth from '../middlewares/auth';
import myReportPermisssion from '../middlewares/myReportPermisssion';
const reportRoute = express.Router();

//productRouter.get('/all',productController.getAll);

reportRoute.get('/operations',reportController.stockOperation);
reportRoute.get('/operation/:id',reportController.viewSingleOperation);
reportRoute.get('/inventory/:id',reportController.Inventory);


reportRoute.get('/distributions',reportController.AllDistribution);
reportRoute.get('/mydistribution',reportController.myDistribution);
reportRoute.get('/distributionDetails/:id',reportController.DistributionDetails);


//non admin
reportRoute.get('/mydemand',myReportPermisssion,reportController.viewMyAllReleted);
reportRoute.get('/myoperations',reportController.myStockOperation);

export default reportRoute;