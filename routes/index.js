import express from 'express';
const router = express.Router();
import {registerController,loginController,userController,refreshController} from '../controllers';
import auth from '../middlewares/auth';
import productRoute from './productRoute';
import operationRoute from './operationRoute';
import locationRoute from './locationRoute';
import reportRoute from './reportRoute';

 router.post('/register',registerController.register);

 router.post('/login',loginController.login);

 router.get('/me',auth,userController.me);
 router.get('/users',userController.allUsers);
 router.post('/refresh',refreshController.refresh);

 router.post('/logout',auth,loginController.logout);

 router.use('/location',locationRoute);
 router.use('/product/',productRoute);

 router.use('/operation',operationRoute);
 router.use('/report',reportRoute);

export default router;