import Joi from 'joi';
import { User ,Role,Sequelize,Location,ForgotToken} from "../../models";
import CustomErrorHandler from './../../services/CustomErrorHandler';
import sendEmail from '../../utils/sendEmail'
import bcrypt from 'bcrypt';
const { Op } = Sequelize;
const userController={


    async me(req, res, next){

        //logic
        //console.log('user control')
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

        console.log('kldsjfaaaaaaaaaaaaaa',req.body);

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

          console.log(' forgot password request');

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


         await  sendEmail(req.body.email,'bindulogic invenotry Forget Password ',`This email is from Bindulogic inventory,this is your password changing link click the link to chang password link:  http://localhost:3000/forgot-password-reset/${newToken.user_id}/${newToken.tem_token} ,use this code to reset your password`);
  

         
         res.json('success');

         


        }catch(err){
            console.log(err);

        }

       

    },


    async allUsers(req, res, next){

        //logic
        console.log('user control')
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

        //logic
        //console.log('user control')
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
        console.log('merun',req.body)
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