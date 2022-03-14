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
 router.get('/role',userController.allRole);
 router.get('/users',auth,userController.allUsers);
 router.put('/edituser',userController.editUser);
 router.post('/refresh',auth,refreshController.refresh);

 router.post('/logout',auth,loginController.logout);

 router.use('/location',locationRoute);
 router.use('/product/',productRoute);

 router.use('/operation',auth,operationRoute);
 router.use('/report',auth,reportRoute);

export default router;