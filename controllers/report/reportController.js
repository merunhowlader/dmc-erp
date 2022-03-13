import Joi from 'joi';
import CustomErrorHandler from './../../services/CustomErrorHandler';
import JwtService from './../../services/JwtService';
import {User, Product,Distribution,Consumer,Units,Location,LocationType,sequelize ,Sequelize,StockOperation,OperationTrackRecord,StockOperationItem,Inventory,RelatedOperation,LoanInventory,ProductSerialised,ProductBatch} from '../../models';
const { Op } = Sequelize;
const loginController ={

    
    async myInventory (req, res, next) {

        let location_id = req.params.id;

        try{
            

          

            const GivenLoan = await  Location.findAll({
                
                include:[ 
                   {
                    model:  LoanInventory ,
                    where: {location_id_from:location_id},
                    as:'to',
                    include:[
                        {
                            
                                model:  Product ,
                                include:{
                                    model:Units
                                }  
                        },
                        {
                            
                            model:  Location ,
                            
                       }
                    
                    
                    ]
                
                }
            
            ]
            }).catch((err)=>{
             
                next(err);
            });


            const TakenLoan = await  Location.findAll({
                
                include:[ 
                   {
                    model:  LoanInventory ,
                    where: {location_id_to:location_id},
                    as:'from',
                    include:[
                        {
                            
                                model:  Product ,
                                include:{
                                    model:Units
                                }  
                        },
                        {
                            
                            model:  Location ,
                            
                       }
                    
                    
                    ]
                
                }
            
            ]
            }).catch((err)=>{
             
                next(err);
            });

            const newTakenLoan = await  Location.findAll({
                
                include: {
            
                            
                    model:   LoanInventory  ,
                    where: {location_id_to:location_id},
                    as:'from',
                    include:[{
                     
                            
                            model:  Location ,
                            
                   
                       
                    },
                    {
                        model:  Product,
                       
                        include:
                            {
                                
                                    model: Units ,
                                  
                            },
                          
                        
                        
                        
                    
                    
                
                    
                    }]
                
            
                   }   
        
            }).catch((err)=>{
             
                next(err);
            });



           

            const inventory = await  Location.findAll({
                include:[ 
                   {
                    model: Inventory ,
                    where: {location_id:location_id},
                    include:[{
                        model: Product,
                        include:{
                            model:Units
                        }

                    },
                    {
                        model:Location,
                        include:{
                            model:LocationType
                        }
                    }
                
                
                ]
                
                }
            
            ]
            }).catch((err)=>{
             
                next(err);
            });

            const myReturnAbleProduct = await  Product.findAll({
                where: {returnable_product:true,root:location_id},
                include:[ 
                   {
                    where: {quantity:{[Op.gt]: 0}},
                    model: Inventory ,

                    include:{
                        model: Location
                    }
                   },
                   {
                        model:Units,
                      
                    },
                    {
                        model:Location

                    }
                
                
                ]
                
                
            
            
            }).catch((err)=>{
             
                next(err);
            });

           


            const othersReturnAbleProduct = await  Product.findAll({
                where: {
                    [Op.and]: [{ returnable_product: true }, { root: {[Op.ne]: location_id}}]
                },
                include:[ 
                   {
                    where: {quantity:{[Op.gt]: 0},location_id:location_id},
                    model: Inventory ,

                    include:{
                        model: Location
                    }
                   },
                   {
                        model:Units,
                      
                    },
                    {
                        model:Location

                    }
                
                
                ]
                
                
            
            
            }).catch((err)=>{
             
                next(err);
            });


            if(inventory && TakenLoan &&GivenLoan && myReturnAbleProduct &&othersReturnAbleProduct){

                res.json({takenLoan:TakenLoan, givenLoan:GivenLoan,inventory:inventory,myReturnAbleProduct:myReturnAbleProduct,othersReturnAbleProduct:othersReturnAbleProduct,newTakenLoan:newTakenLoan})

            }

           

            
    
            
    
         

        }catch(e){
            next(e);

        }






    },
    async AllDistribution (req, res, next) {
        let allDistribution = await Distribution.findAll({
            include:[
               {
                model:StockOperation,
                include:{
                    model:StockOperationItem,
                    include:{
                        model:OperationTrackRecord

                    }
                }
               },
               {
                   model:Consumer
               }
            ]
        },
            
        );
        if(allDistribution){
            res.json(allDistribution);

        }


       
    },
    async AllConsumer (req, res, next) {
        let allConsumer = await Consumer.findAll();
        res.json(allConsumer);
       
    },
     
    async monthlyTransaction (req, res, next) {
        res.json('hello monthy inventory report');
    },
       
    async myDepartment(req, res, next) {
        res.json('hello monthy inventory report');
    },
    async mySubStore(req, res, next) {
        res.json('hello monthy inventory report');
    },
    async productExperation(req, res, next) {
        res.json('hello monthy inventory report');
    },
    async allUsers(req, res, next) {
        res.json('hello monthy inventory report');
    },
    async stockOperation(req, res, next){
        try{

            const exist = await StockOperation.findAll({
              
                include:[ {
                    model: StockOperationItem,
           
                    include:[
                            {
                                model: Product,
                             
                                        include: {
                                            model: Units,

                                    },
                                        
                                
                                required: false,     
                            },{
                                model: OperationTrackRecord,
                            

                            }],
                    required: false,
                
                },{

                    model:Location,
                    attributes:['name'],
                    as:'From'
                    
                    
                },{

                    model:Location,
                    attributes:['name'],
                    as:'To'
                    
                    
                },
                {

                    model:User,
            
                    
                    
                }
            ]
            });

            if(!exist){
                res.json("transaction not found")
            }
            res.json(exist);

        }catch(err){
            
            next(err);
        }
    },
    async viewSingleOperation(req, res, next){
        let id = req.params.id;
 
         try{
 
             const exist = await StockOperation.findOne({
                 where: {operation_id:id},
                 include:[ {
                     model: StockOperationItem,
                     //raw: true,
                     include:[
                             {
                                 model: Product,
                                 //attributes:['name'],
                                         include: {
                                             model: Units,
 
                                     },
                                         
                                 
                                 required: false,     
                             },{
                                 model: OperationTrackRecord,
                             
 
                             }],
                     required: false,
                 
                 },{
 
                     model:Location,
                     attributes:['name'],
                     as:'From'
                     
                     
                 },{
 
                     model:Location,
                     attributes:['name'],
                     as:'To'
                     
                     
                 },
                 {
 
                    model:User,
                    attributes:['name','phone'],
                    
                    
                }
                
                ]
             });
 
             if(!exist){
                 res.json("transaction not found")
             }
             res.json(exist);
 
         }catch(err){
             next(err);
         }
      
     },
     




}

export default loginController;