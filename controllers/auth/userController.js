import Joi from 'joi';
import { User ,Role,Sequelize,Location,ForgotToken} from "../../models";
import CustomErrorHandler from './../../services/CustomErrorHandler';
import sendEmail from '../../utils/sendEmail'
import bcrypt from 'bcrypt';
const { Op } = Sequelize;
const userController={


    async me(req, res, next){

        //logic
        
        try{
            const user = await User.findOne({
                where: {id:req.user.id},
                include:[{
                    model:Role
                },{ 
                    model:Location,
                    as:'Department',
                    required: false,

                }]
            }).catch((err)=>{
                return next(err);
            })

            if(!user){
                return next(CustomErrorHandler.notFound());
            }

            res.json(user);


        }catch(err){

            return next(err);

        }

    },

    async forgotPassword(req, res, next){

        

        const emailSchema=Joi.object({
            email:Joi.string().email().required(),
      
        
 
        })
 
        const {error} =emailSchema.validate(req.body);``
 
       console.error('this is error message',error);
 
        if(error) {
            return next(error);
        }

        try {
          let user= await User.findOne({where: {email:req.body.email}});

          if(!user) {

            next('something wrong happened');

          }

         

          let token =Math.floor(1000 + Math.random() * 9000);

          let userToken= ForgotToken.findOne({where: {user_id:user.id}})
          if(userToken){
           await ForgotToken.destroy({
                where: {
                    user_id:user.id
                }
            })

          }


         let newToken= await ForgotToken.create({user_id:user.id,tem_token:token})


         await  sendEmail(req.body.email,'bindulogic invenotry Forget Password ',`This email is from Bindulogic inventory,this is your password changing link click the link to chang password link:  https://dmc-inventory.netlify.app/forgot-password-reset/${newToken.user_id}/${newToken.tem_token} ,use this code to reset your password`);
  

         
         res.json('success');

         


        }catch(err){
           
            return next(err);

        }

       

    },


    async resetforgetPassword(req, res, next){

     

        const resetPasswordSchema=Joi.object({
            id:Joi.string().required(),
            token:Joi.string().required(),
            Npassword:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            Cpassword:Joi.ref('Npassword'),
      
        
 
        })
 
        const {error} =resetPasswordSchema.validate(req.body);

 
        if(error) {
            return next(error);
        }

        try {
          let resetRequest= await ForgotToken.findOne({where:{[Op.and]:[{user_id:req.body.id},{tem_token:req.body.token}]}});

          if(!resetRequest) {

            next('something wrong happened');

          }

          const hashedPassword = await bcrypt.hash(req.body.Npassword,10).catch((err)=>{
            next(err);
           });

          await User.update({password:hashedPassword},{where:{id:req.body.id}})


         
           await ForgotToken.destroy({
                where: {
                    user_id:req.body.id
                }
            })

           let newUser=await User.findOne({where: {id:req.body.id}}); 



          


         


         await  sendEmail(newUser.email,'bindulogic invenotry Password Change',`your password was changet at ${Date.now()}`);
  

         
         res.json('success');

         


        }catch(err){
            
            return next(err);

        }

       

    },


    async allUsers(req, res, next){

        //logic
       
        try{
            const user = await User.findAll({
                include:[{
                    model:Role
                },{ 
                    model:Location,
                    as:'Department',
                    required: false,

                }]
            }).catch((err)=>{
                return next(err);
            })

            if(!user){
                return next(CustomErrorHandler.notFound());
            }

            res.json(user);


        }catch(err){

            return next(err);

        }

    },

    async allRole(req, res, next){

 
        try{
            const allRole = await Role.findAll({where: {name:{
                [Op.ne]: "SuperAdmin",  
            }}}).catch((err)=>{
                return next(err);
            })

            if(!allRole){
                return next(CustomErrorHandler.notFound());
            }

            res.json(allRole);


        }catch(err){

            return next(err);

        }

    },
    async editUser(req, res, next){

        //logic
     
        try{

            await User.update({role:req.body.role,department:req.body.department,status:req.body.status},{where:{id:req.body.id}}).catch(err=>{
                next(err);
            })


            res.json('updated successfully')
           


        }catch(err){

            return next(err);

        }

    }
    ,
    async editUserPassword(req, res, next){

       

       

        //logic
        let password={
            old:req.body.currentPassword,
            new:req.body.newPassword
        }
        const editPassowrdSchema=Joi.object({
            new:Joi.string().required(),
            old:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(22).required(),
       
            

        })

        const {error} =editPassowrdSchema.validate(password);

       

        if(error) {
            return next(error);
        }
        


       
        try{

            const user = await User.findOne({where:{id:req.user.id}}).catch((err)=>{
                return next(err);
            })

            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            const match = await  bcrypt.compare(password.old,user.password);

            if(!match){

                return next(CustomErrorHandler.wrongCredentials());

            }
            const hashedPassword = await bcrypt.hash(password.new,10).catch((err)=>{
                next(err);
            });

            await User.update({password:hashedPassword},{where:{id:req.user.id}}).catch((err)=>{
                return next(err);
            })




            res.json('password updated successfully')
           


        }catch(err){

            return next(err);

        }

    },

    // async forgotPassword(req, res, next){

    //     try{

    //         const user = await User.findOne({where:{id:req.user.id}}).catch((err)=>{
    //             return next(err);
    //         })

    //         if(!user){
    //             return next(CustomErrorHandler.wrongCredentials());
    //         }

    //         const match = await  bcrypt.compare(password.old,user.password);

    //         if(!match){

    //             return next(CustomErrorHandler.wrongCredentials());

    //         }
    //         const hashedPassword = await bcrypt.hash(password.new,10).catch((err)=>{
    //             next(err);
    //         });

    //         await User.update({password:hashedPassword},{where:{id:req.user.id}}).catch((err)=>{
    //             return next(err);
    //         })




    //         res.json('updated successfully')
           


    //     }catch(err){

    //         return next(err);

    //     }

    // }



};


export default userController;