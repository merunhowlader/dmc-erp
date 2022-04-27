import express from 'express';
import {productController} from '../controllers';
import auth from '../middlewares/auth';
const productRouter = express.Router();

//productRouter.get('/all',productController.getAll);
productRouter.post('/products',auth,productController.store);


productRouter.get('/',productController.getProducts);
productRouter.post('/',productController.addProduct);


productRouter.post('/category',productController.addCategory);
productRouter.get('/category',productController.getCategory);

productRouter.get('/unit',productController.getUnit);
productRouter.post('/unit',productController.addUnit);



productRouter.post('/experation',productController.addProductExperations);
productRouter.get('/experation',productController.getProductExperation);


//add track number seraila and batch number
productRouter.get('/trackingnumber',productController.getTrackingNumber);
productRouter.post('/trackingnumber',productController.addTrackingNumber);



//edit product
productRouter.get('/all',productController.getProductsForEdit);
productRouter.put('/',productController.editProduct);




export default productRouter;