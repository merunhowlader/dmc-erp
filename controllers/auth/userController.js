import Joi from 'joi';
import { User ,Role,Sequelize,Location} from "../../models";
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

        console.log(' forgot password request');
       await  sendEmail('merunhowlader@gmail.com','fuck you','omg ');

       res.json('omg what is going on');

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