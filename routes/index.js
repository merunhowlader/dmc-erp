import express from 'express';
const router = express.Router();
import {registerController,loginController,userController,refreshController, reportController} from '../controllers';
import auth from '../middlewares/auth';
import operationPermission from '../middlewares/operationPermission';
import productRoute from './productRoute';
import operationRoute from './operationRoute';
import locationRoute from './locationRoute';
import reportRoute from './reportRoute';
import contentPermission from '../middlewares/contentPermission';

 router.post('/register',auth,registerController.register);

 router.post('/login',loginController.login);
 router.post('/',loginController.login);
 router.post('/editpassword',auth,userController.editUserPassword);

 router.post('/forgotpassword',userController.forgotPassword);
 router.post('/resetforgetpassword',userController.resetforgetPassword);


 router.get('/me',auth,userController.me);
 router.get('/role',userController.allRole);
 router.get('/users',auth,userController.allUsers);
 router.put('/edituser',userController.editUser);
 router.post('/refresh',refreshController.refresh);

 router.post('/logout',loginController.logout);

 router.use('/location',locationRoute);
 router.use('/product/',productRoute);

 router.use('/operation',auth,operationPermission,contentPermission,operationRoute);

 
 router.use('/report',auth,reportRoute);

export default router;