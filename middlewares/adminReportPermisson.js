import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtService from './../services/JwtService';

import {User,Role} from './../models';

const  adminReportPermisson = async (req, res, next) => {





    try {

        if(req.user.role!== 'Admin' ||req.user.role!== 'SuperAdmin' ){
            return next(CustomErrorHandler.unAuthorizedPermission());

        }
    

        next();

    }catch(err){
        return next(CustomErrorHandler.unAuthorizedPermission());
    }

    console.log(token);

}

export default adminReportPermisson;