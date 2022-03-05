import express from 'express';
import { locationController } from '../controllers';
import auth from '../middlewares/auth';

const locationRoute = express.Router();


locationRoute.get('/',locationController.getAll);
locationRoute.post('/',locationController.addNewLocation);

locationRoute.get('/type',locationController.getTypes);
locationRoute.post('/type',locationController.addType);
//locationRoute.post('/add',stocklocationController.transfer);




export default locationRoute;