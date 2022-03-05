import express from 'express';
import { stockOperationController } from '../controllers';
import auth from '../middlewares/auth';

const operationRoute = express.Router();


operationRoute.get('/',stockOperationController.stockOperation);

operationRoute.post('/transfer',stockOperationController.transfer);
operationRoute.post('/loan',stockOperationController.loan);
operationRoute.post('/loanreturn',stockOperationController.loanReturn);

operationRoute.get('/allinventory',stockOperationController.inventory);
operationRoute.get('/single/:id',stockOperationController.viewSingleOperation);
operationRoute.post('/supply',stockOperationController.supply);

operationRoute.post('/demand',stockOperationController.demand);



export default operationRoute;