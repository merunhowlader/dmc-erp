import express from 'express';
import {reportController} from '../controllers';
import auth from '../middlewares/auth';
const reportRoute = express.Router();

//productRouter.get('/all',productController.getAll);
reportRoute.get('/inventory',reportController.myInventory);

export default reportRoute;