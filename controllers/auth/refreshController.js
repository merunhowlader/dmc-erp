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

           

            return next(CustomErrorHandler.invalidRefreshToken('invalid refresh token 1'));
        }
        let userId;

        
        try {

           

            const {id} =  JwtService.verify(refreshtoken.token,REFRESH_SECRET);
            userId=id;

           
          
           
           
        }catch(err){
            return next(CustomErrorHandler.invalidRefreshToken('invalid refresh token 2'));
        }

        const user = await User.findOne({where:{id:userId}}).catch(err => {
            next(err);
        });

        if(!user){
            return next(CustomErrorHandler.invalidRefreshToken());
        }

        

        const access_token= JwtService.sign({id:user.id,role:user.role,department:user.department});

        //  refresh_token= JwtService.sign({id:user.id,role:user.role,department:user.department},'1y',REFRESH_SECRET);

        // const savedRefreshToken = await RefreshToken.create({token:refresh_token});

     

         res.json({access_token:access_token});



    }catch(err){
        return next(new Error('something went wrong',err.message));
    }




    }
}

export default refreshController;