import Joi, { date } from 'joi';
import { Location,LocationType,sequelize ,Sequelize} from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';

//const { Op } = sequelize;
const { Op } = Sequelize;

const locationController ={


    async getAll(req, res, next){
        console.log(' location route')
        try{

            const exist = await Location.findAll(
                {
               
                    include:[{model: Location, as: 'substore'},{ model: LocationType}]
            
                }).then((data)=>{
                res.json(data);
            }).catch((err)=>{
                return next(err);
            })
            
      
          }catch(err){
              next(err);
            }
        //res.json(" get all products");
    },
    async addNewLocation(req, res, next){

        try{
            
            const exist = await Location.findOne({where:{name:req.body.name}}).catch((err)=>{
                return next(err);
            })
            if(exist){
                 return next(CustomErrorHandler.alreadyExist('location alreadyExist'));
             }
             console.log(req.body);

             if(req.body.isSubStore){
                const exist = await Location.findOne({where:{location_id:req.body.parentLocation}}).catch((err)=>{
                    return next(err);
                })

                if(exist){
                    await Location.create({name:req.body.name,type:exist.type,parentLocation:req.body.parentLocation}).then(data=>{
                        res.json(data);
                    }).catch((err)=>{
                       return next(err);
                   })

                }
                else{
                    return next(CustomErrorHandler.alreadyExist('Root location id not found'));

                }
             }else{

                await Location.create({name:req.body.name,type:req.body.location_type}).then(data=>{
                    res.json(data);
                }).catch((err)=>{
                   return next(err);
               })
                
             }


           
        }catch(err){
            next(err);
        }
    },

   

        
    async addType(req, res, next){

        try{
            
            const exist = await LocationType.findOne({where:{name:req.body.name}}).catch((err)=>{
                return next(err);
            })
            console.log('exist',exist);
             if(exist){
                 console.log(req.body.name);
                 return next(CustomErrorHandler.alreadyExist('type already exist'));
             }
             console.log(req.body);

             await LocationType.create({name:req.body.name}).then(data=>{
                 res.json(data);
             }).catch((err)=>{
                 console.log(err);
                return next(err);
            })

        }catch(err){
            next(err);
        }
    }
    ,
    async getTypes(req, res, next){

        try{
            
            const exist = await LocationType.findAll().then(data=>{
                res.json(data);
            }).catch((err)=>{
                return next(err);
            })

        }catch(err){
            next(err);
        }
    }
    ,
    

      

}


export default locationController;