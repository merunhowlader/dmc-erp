import { User } from "../../models";
import CustomErrorHandler from './../../services/CustomErrorHandler';

const userController={


    async me(req, res, next){

        //logic
        //console.log('user control')
        try{
            const user = await User.findOne({where:{user_id:req.user.id}, attributes: ['user_id','userName', 'role','department'],}).catch((err)=>{
                return next(err);
            })

            if(!user){
                return next(CustomErrorHandler.notFound());
            }

            res.json(user);


        }catch(err){

            return next(err);

        }

    }


};


export default userController;