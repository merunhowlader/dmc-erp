
import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtService from './../services/JwtService';

import {User,Role} from './../models';

const  auth = async (req, res, next) => {


    let authHeader=req.headers.authorization;


    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];
    console.log('this is auth header authorization',token);

    try {
        const mk = JwtService.verify(token);

        console.log(' what the fuck is this',mk);
       

        const {id,role,department} = JwtService.verify(token);

        const CurrentUser = await User.findOne({where: {id: id},
            include:{
                model:Role
            }
        });

      

        

        req.user={};

        req.user.id=id;
        req.user.role=CurrentUser.Role.name;
        req.user.department=department;

        console.log('this is user role',CurrentUser.Role.name)

        next();

    }catch(err){
        return next(CustomErrorHandler.unAuthorized());
    }

    console.log(token);

}

export default auth;