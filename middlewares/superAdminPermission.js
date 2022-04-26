import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';

import {User,Role} from '../models';

const  superAdminPermission = async (req, res, next) => {





    try {

        if(req.user.role!== 'SuperAdmin' ){
            return next(CustomErrorHandler.unAuthorizedPermission());

        }
    

        next();

    }catch(err){
        return next(CustomErrorHandler.unAuthorizedPermission());
    }

  

}

export default superAdminPermission;