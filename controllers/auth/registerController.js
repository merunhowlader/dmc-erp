import Joi from 'joi';

import { RefreshToken, User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';

import bcrypt  from 'bcrypt';

import JwtService from '../../services/JwtService';
import { REFRESH_SECRET } from '../../config';

const registerController={
  async  register(req, res, next){

    console.log('body',req.body);

        //validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(40).required(),
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password:Joi.ref('password'),
            phone:Joi.string().min(10).max(14).required(),
            department:Joi.number().integer().required(),
            role:Joi.number().integer().required(),
            status:Joi.boolean().optional(),

        })

      

        const {error} = registerSchema.validate(req.body);
        console.log(error);



       

        if(error){
            return next(error);
        }


        try{

            const exist = await User.findOne({where:{email:req.body.email}}).catch((err)=>{
                return next(err);
            })
          

   
            console.log('exist',exist);
             if(exist){
                 return next(CustomErrorHandler.alreadyExist('this email is already taken'));
             }

            

        }catch(err){

            return next(err);

        }
        console.log('test 2');

        const hashedPassword = await bcrypt.hash(req.body.password,10).catch((err)=>{
            next(err);
        });

        const {name,email,phone,department,password,role} = req.body;
        const user ={
            name,
            email,
            password:hashedPassword,
            phone,
            department,
            role,
           


        }
       
        console.log('we are before save block',user);
        let access_token;
        let refresh_token;
        try{
            const newUser = new User(user);
            const savedUser = await newUser.save().catch(err =>{
           
                next(err);
            });

            if(savedUser){

                res.json(savedUser);

            //     access_token= JwtService.sign({id:user.user_id,role:user.role,department:user.department});

            //     refresh_token= JwtService.sign({id:user.user_id,role:user.role,department:user.department},'1y',REFRESH_SECRET);

            //     console.log(' newly asign refresh token ',refresh_token);
            //  const savedRefreshToken = await RefreshToken.create({token:refresh_token}).then((data)=>{
    
            //         res.json({access_token:access_token,refresh_token});
                  
    
                   
    
            //     }).catch((err)=>{
            //         next(err);
            //     });
    

            }

           
          
            // if(savedRefreshToken.token){
            //     res.json({access_token:access_token,refresh_token});

            // }

            

            
            
            //JwtService.sign({id:result.id})
        //    if(savedUser){

        //     access_token= JwtService.sign({id:savedUser.user_id,role:savedUser.role})
        //     res.json({access_token:access_token});

        //    }

        }catch(err){
            next(err);

        }



        

    }

}


export default registerController;