import express from 'express';
import { stockOperationController } from '../controllers';
import auth from '../middlewares/auth';

const operationRoute = express.Router();



operationRoute.post('/transfer',stockOperationController.transfer);
operationRoute.post('/loan',stockOperationController.loan);
operationRoute.post('/returnloan/',stockOperationController.loanReturn);

operationRoute.get('/allinventory',stockOperationController.inventory);

operationRoute.post('/supply',stockOperationController.supply);

operationRoute.post('/demand',stockOperationController.demand);
operationRoute.post('/demandsupply',stockOperationController.demandSupply);
operationRoute.post('/distribution',stockOperationController.distribution);
operationRoute.post('/trash',stockOperationController.trash);

operationRoute.get('/allrelatedview',stockOperationController.viewAllReleted);
operationRoute.get('/singlerelatedview/:id',stockOperationController.viewSingleReleted);





export default operationRoute;