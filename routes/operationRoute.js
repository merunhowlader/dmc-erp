import express from 'express';
import { stockOperationController } from '../controllers';
import auth from '../middlewares/auth';
import operationPermission from '../middlewares/operationPermission';

const operationRoute = express.Router();



operationRoute.post('/transfer',stockOperationController.transfer);
operationRoute.post('/loan',stockOperationController.loan);
operationRoute.post('/returnloan/',stockOperationController.loanReturn);

operationRoute.post('/supply',stockOperationController.supply);

operationRoute.post('/demand',stockOperationController.demand);
operationRoute.post('/demandsupply',stockOperationController.demandSupply);
operationRoute.post('/distribution',stockOperationController.distribution);
operationRoute.post('/trash',stockOperationController.trash);
operationRoute.post('/increament',stockOperationController.adjustIncrement);
operationRoute.post('/decrement',stockOperationController.adjustDecrement);


//non amdmin






export default operationRoute;