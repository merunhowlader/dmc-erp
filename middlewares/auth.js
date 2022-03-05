
import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtService from './../services/JwtService';
const  auth = async (req, res, next) => {


    let authHeader=req.headers.authorization;
    console.log(authHeader);

    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];

    try {
        const mk = JwtService.verify(token);
        console.log(mk);

        const {id,role,department} = JwtService.verify(token);

        req.user={};

        req.user.id=id;
        req.user.role=role;
        req.user.department=department;

        next();

    }catch(err){
        return next(CustomErrorHandler.unAuthorized());
    }

    console.log(token);

}

export default auth;