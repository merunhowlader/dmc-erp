import { User ,Role,Sequelize,Location} from "../../models";
import CustomErrorHandler from './../../services/CustomErrorHandler';
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


};


export default userController;