
import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtService from './../services/JwtService';

import {User,Role} from './../models';

const  contentPermission = async (req, res, next) => {



    try {

        if(req.user.role!== 'SuperAdmin' ){

            console.log(' form djlkf',req.body.from ,req.user.department)
            console.log(' form djlkf',req.body.to ,req.user.department)

            if(req.body.from===req.body.to){
                return next(CustomErrorHandler.unAuthorizedPermission());
                
               

            }

            if(req.body.from ===req.user.department||req.body.to ===req.user.department){
                next();
                
               
            }else{
                return next(CustomErrorHandler.unAuthorizedPermission());

            }
     

            
          
           

        }else{
            next();

        }

        
    

       

    }catch(err){
        return next(CustomErrorHandler.unAuthorizedPermission());
    }

    console.log(token);

}

export default contentPermission;