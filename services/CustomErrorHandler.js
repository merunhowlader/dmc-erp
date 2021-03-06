class CustomErrorHandler extends Error{

    constructor(status,msg){
        super();
        this.status = status;
        this.message=msg;

    }
    static alreadyExist(message="already exists"){
        return new CustomErrorHandler(409,message);


    }
    static wrongCredentials(message="Username or password is incorrect"){
        return new CustomErrorHandler(401,message);


    }
    static unAuthorized(message="unAuthorized"){
        return new CustomErrorHandler(401,message);


    }

    static notFound(message="404 not found"){
        return new CustomErrorHandler(404,message);


    }
    
    static invalidRefreshToken(message="invalid refresh token"){
        return new CustomErrorHandler(455,message);


    }
    static unAuthorizedPermission(message="unAuthorized"){
        return new CustomErrorHandler(403,message);


    }
}

export default CustomErrorHandler;