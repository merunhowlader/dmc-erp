
import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtService from './../services/JwtService';

import {User,Role} from './../models';

const  contentPermission = async (req, res, next) => {



    try {

        if(req.user.role!== 'SuperAdmin' ){

           

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



}

export default contentPermission;