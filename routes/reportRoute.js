import express from 'express';
import {reportController} from '../controllers';
import auth from '../middlewares/auth';
import myReportPermisssion from '../middlewares/myReportPermisssion';
const reportRoute = express.Router();

//productRouter.get('/all',productController.getAll);

reportRoute.get('/operations',reportController.stockOperation);

reportRoute.get('/locationsusers',reportController.allLocationUsers);
reportRoute.get('/operation/:id',reportController.viewSingleOperation);
reportRoute.get('/inventory/:id',reportController.Inventory);

reportRoute.get('/notifications/',reportController.getNotifications);
reportRoute.post('/updatenotice/:id',reportController.updateNotifications);



reportRoute.get('/distributions',reportController.AllDistribution);
reportRoute.get('/mydistribution',myReportPermisssion,reportController.myDistribution);
reportRoute.get('/distributiondetails/:id',reportController.DistributionDetails);


//non admin
reportRoute.get('/mydemand',myReportPermisssion,reportController.viewMyAllReleted);
reportRoute.get('/allexpirydate',reportController.viewAllProductExpiryDate);
reportRoute.get('/myoperations',myReportPermisssion,reportController.myStockOperation);


reportRoute.get('/allrelatedview',reportController.viewAllReleted);
reportRoute.get('/singlerelatedview/:id',reportController.viewSingleReleted);

reportRoute.get('/allcount',reportController.allCount);

reportRoute.get('/myproducts/',myReportPermisssion,reportController.mylocationProduct);

export default reportRoute;