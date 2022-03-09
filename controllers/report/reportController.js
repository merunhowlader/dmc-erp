import Joi from 'joi';
import {User} from './../../models';
import CustomErrorHandler from './../../services/CustomErrorHandler';
import JwtService from './../../services/JwtService';
import { Product,Distribution,Consumer,Units,Location,LocationType,sequelize ,Sequelize,StockOperation,OperationTrackRecord,StockOperationItem,Inventory,RelatedOperation,LoanInventory,ProductSerialised,ProductBatch} from '../../models';
const { Op } = Sequelize;
const loginController ={

    
    async myInventory (req, res, next) {

        try{
            

            const Loan = await  Location.findAll({
                
                include:[ 
                   {
                    model:  LoanInventory ,
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
                
                },
                {
                    model:  LoanInventory ,
                    as:'to',
                    include: [
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

           

            const inventory = await  Location.findAll({
                include:[ 
                   {
                    model: Inventory ,
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

            const ReturnAbleProductInventory = await  Product.findAll({
                where: {returnable_product:true},
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


            if(inventory&&Loan&&ReturnAbleProductInventory){

                res.json({inventory:inventory,loan:Loan,returnAbleProductInventory:ReturnAbleProductInventory})

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




}

export default loginController;