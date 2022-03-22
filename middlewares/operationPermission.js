
import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtService from './../services/JwtService';

import {User,Role} from './../models';

const  operationPermission = async (req, res, next) => {



    try {

        if(req.user.role=== 'Admin' ){
            return next(CustomErrorHandler.unAuthorizedPermission());

        }

        
    

        next();

    }catch(err){
        return next(CustomErrorHandler.unAuthorizedPermission());
    }

    console.log(token);

}

export default operationPermission;