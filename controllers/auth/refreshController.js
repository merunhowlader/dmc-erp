import Joi from 'joi';
import { REFRESH_SECRET } from '../../config';
import { RefreshToken, User } from '../../models';
import JwtService from '../../services/JwtService';
import CustomErrorHandler from './../../services/CustomErrorHandler';

const refreshController={

   async refresh(req,res,next){

    const refreshSchema=Joi.object({
        refresh_token:Joi.string().required(),
       
        

    })

    const {error} =refreshSchema.validate(req.body);

   

    if(error) {
        return next(error);
    }
    let refreshtoken;
    try {

        refreshtoken = await RefreshToken.findOne({where:{token:req.body.refresh_token}}).catch((err)=>{
            return next(err);
        })

        if(!refreshtoken){
            return next(CustomErrorHandler.unAuthorized('invalid refresh token 1'));
        }
        let userId;

        console.log('refresh token: ' + refreshtoken.token);
        try {

            console.log('refresh token try block: ' + refreshtoken.token);

            const {id} =  JwtService.verify(refreshtoken.token,REFRESH_SECRET);
            userId=id;

            console.log(' varify user: ' + id);
          
           
           
        }catch(err){
            return next(CustomErrorHandler.unAuthorized('invalid refresh token 2'));
        }

        const user = await User.findOne({where:{user_id:userId}}).catch(err => {
            next(err);
        });

        if(!user){
            return next(CustomErrorHandler.unAuthorized('no user found'));
        }

        const access_token= JwtService.sign({id:user.user_id,role:user.role});

        const  refresh_token= JwtService.sign({id:user.user_id,role:user.role},'1y',REFRESH_SECRET);

         console.log(' newly asign refresh token ',refresh_token);
         const savedRefreshToken = await RefreshToken.create({token:refresh_token});

         res.json({access_token:access_token,refresh_token});



    }catch(err){
        return next(new Error('something went wrong',err.message));
    }




    }
}

export default refreshController;