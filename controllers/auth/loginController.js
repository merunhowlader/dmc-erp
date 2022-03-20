import Joi from 'joi';
import {User} from './../../models';
import CustomErrorHandler from './../../services/CustomErrorHandler';
import JwtService from './../../services/JwtService';
import bcrypt from 'bcrypt';
import { RefreshToken } from '../../models';
import { REFRESH_SECRET } from '../../config';

const loginController ={

    async login (req, res, next) {

        console.log(' body', req.body);


     
        const loginSchema=Joi.object({
            phone:Joi.string().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            

        })

        const {error} =loginSchema.validate(req.body);

       

        if(error) {
            return next(error);
        }

        try {
            const user = await User.findOne({where:{phone:req.body.phone}}).catch((err)=>{
                return next(err);
            })

            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            const match = await  bcrypt.compare(req.body.password,user.password);

            if(!match||user.status!==true){

                return next(CustomErrorHandler.wrongCredentials());

            }
            const access_token= JwtService.sign({id:user.id,role:user.role,department:user.department});

           const  refresh_token= JwtService.sign({id:user.id,role:user.role,department:user.department},'1y',REFRESH_SECRET);

            console.log(' newly asign refresh token ',refresh_token);
            const savedRefreshToken = await RefreshToken.create({token:refresh_token}).then((data)=>{

                res.json({access_token:access_token,refresh_token});
              

               

            }).catch((err)=>{
                next(err);
            });

            //res.json({access_token});

            //compare the password
          

        }catch(error) {
            return next(error);

        }

    },

    async logout(req,res, next){
        const refreshSchema=Joi.object({
            refresh_token:Joi.string().required(),
           
            
    
        })
    
        const {error} =refreshSchema.validate(req.body);
    
       
    
        if(error) {
            return next(error);
        }

        try {

            await RefreshToken.destroy({
                where: {

                    token:req.body.refresh_token
                    // criteria
                }
            })

        }catch(error) {
            return next(new Error(' something went  wrong in the database'));
        }

        res.json({status: 'success'});

    }

}

export default loginController;