import Joi from 'joi';
import { Product,Consumer,Distribution,Units,Location,LocationType,sequelize ,Sequelize,StockOperation,StockOperationItem,Inventory,RelatedOperation,LoanInventory,ProductSerialised,ProductBatch, OperationTrackRecord} from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';

import bodyValidation from '../../services/operation/bodyValidation';
const { Op } = Sequelize;

const stockOperationController ={
    
    async makeOutTransaction(req, res, next){
        res.json("hi");


     }

    ,
    async distribution(req, res, next){
        let allTransactionsItems=[...req.body.items];
        console.log('distribution');

        console.log('this form items',allTransactionsItems);

       let mainOperationData ={
           from:req.body.from,
           to:req.body.to,
           reference:req.body.reference,
           createdBy:req.user.id,
           operationType:"Distribution",
       }

       let consumer={
           name:req.body.name,
           phone:req.body.phone,
           total:req.body.total
       }

       let formData={
           from:req.body.from,
           to:req.body.to,
           reference:req.body.reference,
           phone:req.body.phone,
           createdBy:req.user.id,
           operationType:"Distribution",
           items:req.body.items
       }

       const supplySchema=Joi.object({
        from:Joi.number().integer().required(),
        to:Joi.number().integer().disallow(Joi.ref('from')).required(),
        reference: Joi.string().allow(""),
        phone:Joi.number().required(),
        operationType:Joi.string().allow(""),
        createdBy:Joi.number().integer().required(),
        items: Joi.array().items(Joi.object().keys(
            {product_id:Joi.number().integer().required(),
             item_name:Joi.string(),
             unit:Joi.string(),
             amount:Joi.number().integer().required(),
             count_type: Joi.number().integer().required(),
             track_data:Joi.array().items(Joi.object().keys({
                track_id:Joi.string().required(),
                quantity:Joi.number().integer().required(),
             }).when('count_type', { is: 0, then: Joi.optional(), otherwise: Joi.required() })
             )
            }).min(1)).required()
       
        

    })

       const {error} =supplySchema.validate(formData);

       if(error) {
        return next(error);
    }

       await sequelize.transaction(async (t) => {
        const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
            next(err);
        });
        if(!newOperation){
            next(new Error(' fast transaction error'));
        }
  
        let length=allTransactionsItems.length;
        let AllExixtBatchTo=[];

      let AllExistSerialFrom=[];

        for(let i=0; i<length;i++){
           let itemData={
               product_id:allTransactionsItems[i].product_id,
               quantity:allTransactionsItems[i].amount,
               stockOperationId:newOperation.operation_id
           }
          
           let newlyCreatedItem= await StockOperationItem.create(itemData,{transaction: t}).catch((err)=>{
            t.rollback()
            next(err);
         });

           if(allTransactionsItems[i].count_type===2){
             
            let itemBatch =allTransactionsItems[i].track_data;
            const asyncRes = await Promise.all(itemBatch.map(async (d) => {
                console.log('check track id',d);
            await OperationTrackRecord.create({track_id:d.track_id, quantity:d.quantity,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                    next(err);
                 });
            const checkDataExistTo=await ProductBatch.findOne({where:{batch_number:d.track_id,location_id:req.body.to}}).catch((err)=>{
                                   next(err);
                       })
                return checkDataExistTo;
               }));
           AllExixtBatchTo.push({index:i,array:asyncRes});    
             
          }
          if(allTransactionsItems[i].count_type===1){
           
            let itemSerial =allTransactionsItems[i].track_data;

            const asyncSerialRes = await Promise.all(itemSerial.map(async (d) => {
                console.log('check track id',d);

                await OperationTrackRecord.create({track_id:d.track_id, quantity:1,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                    t.rollback()
                    next(err);
                 });

                
                const checkDataExistTo=await ProductSerialised.findOne({where:{serial_number:d.track_id}}).catch((err)=>{
                    t.rollback()
                        next(err);
                        })
             
                 return checkDataExistTo;

                }));
            AllExistSerialFrom.push({index:i,array:asyncSerialRes});   
          
             
          }
        



        }

  
        
        let promises = [];
        let i=0;


        

  
       

        for ( i; i < allTransactionsItems.length ; i++) {
                let checkFrom= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.from}}).catch(err => {
                    next(err);
                })
                let checkTo= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.to}}).catch(err => {
                    next(err);
                })
                console.log('this is check value' ,checkFrom);

                if(checkFrom){
                    promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity - ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.from} ,transaction: t}));

                }else{
                    promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.from,quantity:-allTransactionsItems[i].amount},{transaction: t}))

                }
                if(checkTo){
                    promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t }));

                }else{
                    promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                }
   
       }

       const ConsumerExist = await Consumer.findOne({where: {phone:consumer.phone},transaction: t}).catch((err)=>{
        next(err);
        });

        if(!ConsumerExist){
               const newConsumer=await Consumer.create(consumer,{transaction: t}).catch((err)=>{
                next(err);
                });

                const newDistribution= await  Distribution.create({op_id:newOperation.operation_id,consumer_id:newConsumer.id,total:consumer.total},{transaction: t})

            
            
        }else{
            const newDistribution= await  Distribution.create({op_id:newOperation.operation_id,consumer_id:ConsumerExist.id,total:consumer.total},{transaction: t})

        }

       



      
       for(let i=0; i<AllExistSerialFrom.length; i++){
     
        let index=AllExistSerialFrom[i].index;


        for(let j=0; j<AllExistSerialFrom[i].array.length ; j++){
              let exist=AllExistSerialFrom[i].array[j];

              console.log('exist serial check',allTransactionsItems[index].track_data[j].track_id);

  
              let serialNumber=allTransactionsItems[index].track_data[j].track_id;
          
              let productId= allTransactionsItems[index].product_id;
              let locationIdTo=req.body.to;
              let locationIdFrom=req.body.from;
              

        
                if(exist){   

                    promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: serialNumber, product_id: productId,location_id:req.body.from},transaction: t}));
                    
          
                  }       
                  else{

                    //not found serial number for transfar in inventory

                 
                    //res.json("give valid Serial  id")
                 
                  }


        }

    }

      for(let i=0; i<AllExixtBatchTo.length; i++){
     
          let index=AllExixtBatchTo[i].index;
          for(let j=0; j<AllExixtBatchTo[i].array.length ; j++){
            let exist=AllExixtBatchTo[i].array[j];
            console.log('exist serial check',allTransactionsItems[index].track_data[j].track_id);
            let batchNumber=allTransactionsItems[index].track_data[j].track_id;
            let quantity=  allTransactionsItems[index].track_data[j].quantity ;
            let productId= allTransactionsItems[index].product_id;
            let locationIdTo=req.body.to;
            let locationIdFrom=req.body.from;
            
             if(exist){   
                 promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity + ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdTo},transaction: t}))
    
             }       
             else{
                promises.push(ProductBatch.create({ batch_number: batchNumber, product_id: productId,location_id:locationIdTo,quantity:quantity},{transaction: t})); 
             }

             promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity - ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdFrom},transaction: t}))

            

          }

      }

      console.log("to this point");

      



 
     return  await Promise.all(promises)

    }).then(function (result) {
        console.log("YAY");
        res.status(200).json('your operation was successfully done')
    }).catch(function (err) {
        console.log(err);
        next(new Error(' something happer in sypply error'));
    });




     },
    async transfer(req, res, next){

        console.log('this the user data  that we nedd',req.user);
        console.log(req.body);

        let allTransactionsItems=[...req.body.items];

        console.log('this form items',allTransactionsItems);

       let mainOperationData ={
           from:req.body.from,
           to:req.body.to,
           reference:req.body.reference,
           createdBy:req.user.id,
           operationType:"transfer",
       }

       let formData={
           from:req.body.from,
           to:req.body.to,
           reference:req.body.reference,
           createdBy:req.user.id,
           operationType:"transfer",
           items:req.body.items
       }




           
       const supplySchema=Joi.object({
           from:Joi.number().integer().required(),
           to:Joi.number().integer().disallow(Joi.ref('from')).required(),
           reference: Joi.string().allow(""),
           operationType:Joi.string().allow(""),
           createdBy:Joi.number().integer().required(),
           items: Joi.array().items(Joi.object().keys(
               {product_id:Joi.number().integer().required(),
                item_name:Joi.string(),
                unit:Joi.string(),
                amount:Joi.number().integer().required(),
                count_type: Joi.number().integer().required(),
                track_data:Joi.array().items(Joi.object().keys({
                   track_id:Joi.string().required(),
                   quantity:Joi.number().integer().required(),
                }).when('count_type', { is: 0, then: Joi.optional(), otherwise: Joi.required() })
                )
               }).min(1)).required()
          
           

       })

       const {error} =supplySchema.validate(formData);

      console.error('this is error message',error);

       if(error) {
           return next(error);
       }



        let t;
        
        await sequelize.transaction(async (t) => {
            const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
                next(err);
            });
            if(!newOperation){
                next(new Error(' fast transaction error'));
            }
      
            let length=allTransactionsItems.length;
            let AllExixtBatchTo=[];

          let AllExistSerialFrom=[];

            for(let i=0; i<length;i++){
               let itemData={
                   product_id:allTransactionsItems[i].product_id,
                   quantity:allTransactionsItems[i].amount,
                   stockOperationId:newOperation.operation_id
               }
              
               let newlyCreatedItem= await StockOperationItem.create(itemData,{transaction: t}).catch((err)=>{
                t.rollback()
                next(err);
             });

               if(allTransactionsItems[i].count_type===2){
                 
                let itemBatch =allTransactionsItems[i].track_data;
                const asyncRes = await Promise.all(itemBatch.map(async (d) => {
                    console.log('check track id',d);
                await OperationTrackRecord.create({track_id:d.track_id, quantity:d.quantity,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        next(err);
                     });
                const checkDataExistTo=await ProductBatch.findOne({where:{batch_number:d.track_id,location_id:req.body.to}}).catch((err)=>{
                                       next(err);
                           })
                    return checkDataExistTo;
                   }));
               AllExixtBatchTo.push({index:i,array:asyncRes});    
                 
              }
              if(allTransactionsItems[i].count_type===1){
               
                let itemSerial =allTransactionsItems[i].track_data;
  
                const asyncSerialRes = await Promise.all(itemSerial.map(async (d) => {
                    console.log('check track id',d);
  
                    await OperationTrackRecord.create({track_id:d.track_id, quantity:1,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        t.rollback()
                        next(err);
                     });
  
                    
                    const checkDataExistTo=await ProductSerialised.findOne({where:{serial_number:d.track_id}}).catch((err)=>{
                        t.rollback()
                            next(err);
                            })
                 
                     return checkDataExistTo;
  
                    }));
                AllExistSerialFrom.push({index:i,array:asyncSerialRes});   
              
                 
              }
            



            }

      
            
            let promises = [];
            let i=0;


            

      
           

            for ( i; i < allTransactionsItems.length ; i++) {
                    let checkFrom= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.from}}).catch(err => {
                        next(err);
                    })
                    let checkTo= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.to}}).catch(err => {
                        next(err);
                    })
                    console.log('this is check value' ,checkFrom);

                    if(checkFrom){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity - ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.from} ,transaction: t}));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.from,quantity:-allTransactionsItems[i].amount},{transaction: t}))

                    }
                    if(checkTo){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t }));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                    }

                //    if(allTransactionsItems[i].count_type===1){
                //         let trackItemsLength=allTransactionsItems[i].track_data.length;
                //          for (let j =0 ; j<trackItemsLength ; j++){

                //             console.log('seerail numbers',allTransactionsItems[i].track_data[j].track_id);
                         

                //           promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: allTransactionsItems[i].track_data[j].track_id, product_id: allTransactionsItems[i].product_id,location_id:req.body.from}}));
                         
                        
                //         }
                     
                //      }   
           }

           



          
           for(let i=0; i<AllExistSerialFrom.length; i++){
         
            let index=AllExistSerialFrom[i].index;


            for(let j=0; j<AllExistSerialFrom[i].array.length ; j++){
                  let exist=AllExistSerialFrom[i].array[j];

                  console.log('exist serial check',allTransactionsItems[index].track_data[j].track_id);

      
                  let serialNumber=allTransactionsItems[index].track_data[j].track_id;
              
                  let productId= allTransactionsItems[index].product_id;
                  let locationIdTo=req.body.to;
                  let locationIdFrom=req.body.from;
                  

            
                    if(exist){   

                        promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: serialNumber, product_id: productId,location_id:req.body.from},transaction: t}));
                        
              
                      }       
                      else{

                        //not found serial number for transfar in inventory

                     
                        //res.json("give valid Serial  id")
                     
                      }


         
                  
                  

            }

        }

          for(let i=0; i<AllExixtBatchTo.length; i++){
         
              let index=AllExixtBatchTo[i].index;
              for(let j=0; j<AllExixtBatchTo[i].array.length ; j++){
                let exist=AllExixtBatchTo[i].array[j];
                console.log('exist serial check',allTransactionsItems[index].track_data[j].track_id);
                let batchNumber=allTransactionsItems[index].track_data[j].track_id;
                let quantity=  allTransactionsItems[index].track_data[j].quantity ;
                let productId= allTransactionsItems[index].product_id;
                let locationIdTo=req.body.to;
                let locationIdFrom=req.body.from;
                
                 if(exist){   
                     promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity + ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdTo},transaction: t}))
        
                 }       
                 else{
                    promises.push(ProductBatch.create({ batch_number: batchNumber, product_id: productId,location_id:locationIdTo,quantity:quantity},{transaction: t})); 
                 }

                 promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity - ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdFrom},transaction: t}))

                

              }

          }

          console.log("to this point");
     
          await Promise.all(promises);
          return  newOperation;

        }).then(function (result) {
            console.log("YAY");
            res.status(200).json('your operation was successfully done')
        }).catch(function (err) {
            console.log(err);
            next(new Error(' something happer in sypply error'));
        });

    },
    async loan(req, res, next){

        
        console.log('this is request form body',req.body.items);
        
        //next('new error');
        //res.json(req.body);

         let allTransactionsItems=[...req.body.items];
         console.log('all items data check',allTransactionsItems);

        let mainOperationData ={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:req.user.id,
            operationType:"loan",
        }

        let formData={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:req.user.id,
            operationType:"loan",
            items:req.body.items
        }




            
        const supplySchema=Joi.object({
            from:Joi.number().integer().required(),
            to:Joi.number().integer().disallow(Joi.ref('from')).required(),
            reference: Joi.string().allow(""),
            operationType:Joi.string().allow(""),
            createdBy:Joi.number().integer().required(),
            items: Joi.array().items(Joi.object().keys(
                {product_id:Joi.number().integer().required(),
                 item_name:Joi.string(),
                 unit:Joi.string(),
                 amount:Joi.number().integer().required(),
                 count_type: Joi.number().integer().required(),
                 track_data:Joi.array().items(Joi.object().keys({
                    track_id:Joi.string().required(),
                    quantity:Joi.number().integer().required(),
                 }).when('count_type', { is: 0, then: Joi.optional(), otherwise: Joi.required() })
                 )
                }).min(1)).required()
           
            

        })

        const {error} =supplySchema.validate(formData);

       console.error('this is error message',error);

        if(error) {
            return next(error);
        }


    await sequelize.transaction(async (t) => {
            const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
                next(err);
            });
          
        
            if(!newOperation){
                next(new Error(' fast transaction error'));
            }
        
            let length=allTransactionsItems.length;
            let AllExixtBatchTo=[];

            let AllExistSerialTo=[];
           

     

            for(let i=0; i<length;i++){
               let itemData={
                   product_id:allTransactionsItems[i].product_id,
                   quantity:allTransactionsItems[i].amount,
                   stockOperationId:newOperation.operation_id
              
               }
               let newlyCreatedItem= await StockOperationItem.create(itemData,{transaction: t}).catch((err)=>{
                t.rollback()
                next(err);
             });
              
               

               if(allTransactionsItems[i].count_type===2){
                 
                let itemBatch =allTransactionsItems[i].track_data;
                console.log('item batch test',itemBatch);
               const asyncRes = await Promise.all(itemBatch.map(async (d) => {
                   console.log('batch track data',d);
                await OperationTrackRecord.create({track_id:d.track_id, quantity:d.quantity,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                    next(err);
                 });
                   const checkDataExistTo=await ProductBatch.findOne({where:{batch_number:d.track_id,location_id:req.body.to}}).catch((err)=>{
                                       next(err);
                           })
                
                    return checkDataExistTo;

                   }));
               AllExixtBatchTo.push({index:i,array:asyncRes});    
                 
              }

              if(allTransactionsItems[i].count_type===1){
                 
                let itemSerial =allTransactionsItems[i].track_data;

                const asyncSerialRes = await Promise.all(itemSerial.map(async (d) => {
                    console.log('batch track data',d);
                    await OperationTrackRecord.create({track_id:d.track_id, quantity:1,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        t.rollback()
                        next(err);
                     });
                    const checkDataExistTo=await ProductSerialised.findOne({where:{serial_number:d.track_id}}).catch((err)=>{
                                        next(err);
                            })
                 
                     return checkDataExistTo;
 
                    }));
                AllExistSerialTo.push({index:i,array:asyncSerialRes});   
              
                 
              }
            }

            console.log("to this point")
    
           

          

            let promises = [];
            let i=0;
            for ( i; i < allTransactionsItems.length ; i++) {


                    let checkFrom= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.from},transaction: t}).catch(err => {
                        
                        next(err);

                    })

                    let checkTo= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t}).catch(err => {
                        next(err);
                    })

                    let checkLoan= await LoanInventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id_from: req.body.from,location_id_to: req.body.to},transaction: t}).catch(err => {
                
                        next(err);
        
                    }) 
                    if(checkFrom){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity - ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.from},transaction: t }));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.from,quantity:-allTransactionsItems[i].amount},{transaction: t}))

                    }
                    if(checkTo){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t }));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                    }





                    if(checkLoan){
                        promises.push(LoanInventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id_from: req.body.from},transaction: t }));

                    }else{
                        promises.push( LoanInventory.create({ product_id: allTransactionsItems[i].product_id,location_id_from: req.body.from,location_id_to: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                    }

       


                    // if(allTransactionsItems[i].count_type===1){
                    //     let trackItemsLength=allTransactionsItems[i].track_data.length;

                          
                    //      for (let j =0 ; j<trackItemsLength ; j++){

                    //         console.log('seerail numbers',allTransactionsItems[i].track_data[j].track_id);
                         

                    //       promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: allTransactionsItems[i].track_data[j].track_id, product_id: allTransactionsItems[i].product_id,location_id:req.body.from}}));
                         
                        
                    //     }
                     
                    //  }
                
                }


                for(let i=0; i<AllExistSerialTo.length; i++){
           
                    let index=AllExistSerialTo[i].index;
  
  
                    for(let j=0; j<AllExistSerialTo[i].array.length ; j++){
                          let exist=AllExistSerialTo[i].array[j];
              
                          let serialNumber=allTransactionsItems[index].track_data[j].track_id;
                      
                          let productId= allTransactionsItems[index].product_id;
                          let locationIdTo=req.body.to;
                          let locationIdFrom=req.body.from;
                          
                          if(exist){   
                              promises.push(ProductSerialised.update({ location_id:locationIdTo},{where:{serial_number:serialNumber },transaction: t}))
                  
                          }       
                          else{
                              promises.push(ProductSerialised.create({ serial_number: serialNumber, product_id: productId,location_id:locationIdTo},{transaction: t})); 
                          }
      
                    }
      
                }


          for(let i=0; i<AllExixtBatchTo.length; i++){

              let index=AllExixtBatchTo[i].index;
              for(let j=0; j<AllExixtBatchTo[i].array.length ; j++){
                let exist=AllExixtBatchTo[i].array[j];
                let batchNumber=allTransactionsItems[index].track_data[j].track_id;
                let quantity=  allTransactionsItems[index].track_data[j].quantity ;
                let productId= allTransactionsItems[index].product_id;
                let locationIdTo=req.body.to;
                let locationIdFrom=req.body.from;
                
                 if(exist){   
                     promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity + ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdTo},transaction: t}))
        
                 }       
                 else{
                    promises.push(ProductBatch.create({ batch_number: batchNumber, product_id: productId,location_id:locationIdTo,quantity:quantity},{transaction: t})); 
                 }

                 promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity - ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdFrom},transaction: t}))

                

              }

          }

        

   


    
     
          return  await Promise.all(promises);

        }).then(function (result) {
            console.log("YAY");
            res.status(200).json('your operation was successfully done')
        }).catch(function (err) {
            console.log("NO!!!");
            next(new Error(' Somthing Wrong happen please Try aganin'));
        });

    },

    async loanReturn(req, res, next){

        console.log('this is request form body',req.body);
        
        //next('new error');
        //res.json(req.body);

         let allTransactionsItems=[...req.body.items];
         console.log('all items data check',allTransactionsItems);

        let mainOperationData ={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:req.user.id,
            operationType:"returnLoan",
        }

        let formData={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:1,
            operationType:"returnLoan",
            items:req.body.items
        }




            
        const supplySchema=Joi.object({
            from:Joi.number().integer().required(),
            to:Joi.number().integer().disallow(Joi.ref('from')).required(),
            reference: Joi.string().allow(""),
            operationType:Joi.string().allow(""),
            createdBy:Joi.number().integer().required(),
            items: Joi.array().items(Joi.object().keys(
                {product_id:Joi.number().integer().required(),
                 item_name:Joi.string(),
                 unit:Joi.string(),
                 amount:Joi.number().integer().required(),
                 count_type: Joi.number().integer().required(),
                 track_data:Joi.array().items(Joi.object().keys({
                    track_id:Joi.string().required(),
                    quantity:Joi.number().integer().required(),
                 }).when('count_type', { is: 0, then: Joi.optional(), otherwise: Joi.required() })
                 )
                }).min(1)).required()
           
            

        })

        const {error} =supplySchema.validate(formData);

       console.error('this is error message',error);

        if(error) {
            return next(error);
        }


    await sequelize.transaction(async (t) => {
            const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
                next(err);
            });
          
        
            if(!newOperation){
                next(new Error(' fast transaction error'));
            }
           
            let length=allTransactionsItems.length;
            let AllExixtBatchTo=[];
  
            let AllExistSerialTo=[];

     

            for(let i=0; i<length;i++){
               let itemData={
                   product_id:allTransactionsItems[i].product_id,
                   quantity:allTransactionsItems[i].amount,
                   stockOperationId:newOperation.operation_id
              
               }
              
               let newlyCreatedItem= await StockOperationItem.create(itemData,{transaction: t}).catch((err)=>{
                t.rollback()
                next(err);
             });
               

               if(allTransactionsItems[i].count_type===2){
                 
                 let itemBatch =allTransactionsItems[i].track_data;
                const asyncRes = await Promise.all(itemBatch.map(async (d) => {

                    await OperationTrackRecord.create({track_id:d.track_id, quantity:d.quantity,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        next(err);
                     });
                    const checkDataExistTo=await ProductBatch.findOne({where:{batch_number:d.track_id,location_id:req.body.to}}).catch((err)=>{
                                        next(err);
                            })
                 
                     return checkDataExistTo;

                    }));
                AllExixtBatchTo.push({index:i,array:asyncRes});    
                  
               }

               if(allTransactionsItems[i].count_type===1){
               
                let itemSerial =allTransactionsItems[i].track_data;
  
                const asyncSerialRes = await Promise.all(itemSerial.map(async (d) => {
  
                    await OperationTrackRecord.create({track_id:d.track_id, quantity:1,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        t.rollback()
                        next(err);
                     });
  
                    
                    const checkDataExistTo=await ProductSerialised.findOne({where:{serial_number:d.track_id}}).catch((err)=>{
                        t.rollback()
                            next(err);
                            })
                 
                     return checkDataExistTo;
  
                    }));
                AllExistSerialTo.push({index:i,array:asyncSerialRes});   
              
                 
              }

     


             
            }



        
            
               

            let promises = [];
            let i=0;
           

            for ( i; i < allTransactionsItems.length ; i++) {


                    let checkFrom= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.from},transaction: t}).catch(err => {
                        
                        next(err);

                    })

                    let checkTo= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t}).catch(err => {
                        next(err);
                    })

                    let checkLoan= await LoanInventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id_from: req.body.to,location_id_to: req.body.from},transaction: t}).catch(err => {
                
                        next(err);
        
                    })


                    if(checkFrom){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity - ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.from},transaction: t}));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.from,quantity:-allTransactionsItems[i].amount},{transaction: t}))

                    }
                    if(checkTo){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t }));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                    }





                    if(checkLoan){
                        promises.push(LoanInventory.update({ quantity:  sequelize.literal(`quantity - ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id_from: req.body.to,location_id_to: req.body.from} ,transaction: t}));

                    }else{
                        promises.push( LoanInventory.create({ product_id: allTransactionsItems[i].product_id,location_id_from: req.body.from,location_id_to: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                    }

       


                    // if(allTransactionsItems[i].count_type===1){
                    //     let trackItemsLength=allTransactionsItems[i].track_data.length;

                          
                    //      for (let j =0 ; j<trackItemsLength ; j++){

                    //         console.log('seerail numbers',allTransactionsItems[i].track_data[j].track_id);
                         

                    //       promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: allTransactionsItems[i].track_data[j].track_id, product_id: allTransactionsItems[i].product_id,location_id:req.body.from}}));
                         
                        
                    //     }
                     
                    //  }
                
                }


         
      for(let i=0; i<AllExistSerialTo.length; i++){
         
                    let index=AllExistSerialTo[i].index;
    
    
                    for(let j=0; j<AllExistSerialTo[i].array.length ; j++){
                          let exist=AllExistSerialTo[i].array[j];
    
                          console.log('exist serial check',exist);
              
                          let serialNumber=allTransactionsItems[index].track_data[j].track_id;
                      
                          let productId= allTransactionsItems[index].product_id;
                          let locationIdTo=req.body.to;
                          let locationIdFrom=req.body.from;
                          
                          if(exist){   
                              promises.push(ProductSerialised.update({ location_id:locationIdTo},{where:{serial_number:serialNumber },transaction: t}))
                  
                          }       
                          else{
                              promises.push(ProductSerialised.create({ serial_number: serialNumber, product_id: productId,location_id:locationIdTo},{transaction: t})); 
                          }
      
                    }
      
             }


          for(let i=0; i<AllExixtBatchTo.length; i++){
            //   console.log('i',i);
            //   console.log(AllExixtBatchTo);
            //   console.log(AllExixtBatchTo[i].index);
            //   console.log(AllExixtBatchTo[i].array);
              let index=AllExixtBatchTo[i].index;
              for(let j=0; j<AllExixtBatchTo[i].array.length ; j++){
                let exist=AllExixtBatchTo[i].array[j];
                //console.log(exist);
                let batchNumber=allTransactionsItems[index].track_data[j].track_id;
                let quantity=  allTransactionsItems[index].track_data[j].quantity ;
                let productId= allTransactionsItems[index].product_id;
                let locationIdTo=req.body.to;
                let locationIdFrom=req.body.from;
                
                 if(exist){   
                     promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity + ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdTo}}))
        
                 }       
                 else{
                    promises.push(ProductBatch.create({ batch_number: batchNumber, product_id: productId,location_id:locationIdTo,quantity:quantity})); 
                 }

                 promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity - ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdFrom}}))

                

              }

          }

        

   


    
     
          return await Promise.all(promises)
    

        }).then(function (result) {
            console.log("YAY");
            res.status(200).json('your operation was successfully done')
        }).catch(function (err) {
            console.log("NO!!!");
            next(new Error(' Somthing Wrong happen please Try aganin'));
        });

    },
    async demand(req, res, next){

        let allTransactionsItems=[...req.body.items];

        let userId=req.user.id;
        
        let mainOperationData ={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:userId,
            operationType:"demand",
        }

        let formData={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:userId,
            operationType:"demand",
            items:req.body.items
        }




            
        const demandSchema=Joi.object({
            from:Joi.number().integer().required(),
            to:Joi.number().integer().disallow(Joi.ref('from')).required(),
            reference: Joi.string().allow(""),
            operationType:Joi.string().allow(""),
            createdBy:Joi.number().integer().required(),
            items: Joi.array().items(Joi.object().keys(
                {product_id:Joi.number().integer().required(),
                 item_name:Joi.string(),
                 unit:Joi.string(),
                 amount:Joi.number().integer().required(),
                 count_type: Joi.number().integer().required(),
                }).min(1)).required()
           
            

        })

        const {error} =demandSchema.validate(formData);

       console.error('this is error message',error);

       console.log(mainOperationData.operationType);

        if(error) {
            return next(error);
        }
        await sequelize.transaction(async (t) => {
            const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
                next(err);
            });

            let allItem=[];
        
            if(!newOperation){
                next(new Error(' fast transaction error'));
            }
          
            let length=allTransactionsItems.length;

            for(let i=0; i<length;i++){
                let itemData={
                    product_id:allTransactionsItems[i].product_id,
                    quantity:allTransactionsItems[i].amount,
                    stockOperationId:newOperation.operation_id
               
                }
                allItem.push(itemData);
               
             }

             await StockOperationItem.bulkCreate(allItem,{transaction: t}).catch((err)=>{
                next(err);
                })

                console.log(newOperation.operation_id);
              

               

             let newRelatedOperation=await RelatedOperation.create({act_id:newOperation.operation_id,demand_operation:mainOperationData.operationType,demandStatus:"Requested"},{transaction: t}).catch((err)=>{
                    next(err);
                  })


                  
                  return newRelatedOperation;



               
 
  

     

       
          
      }).then(function (result) {
          console.log(result);
        console.log("YAY");
        res.status(200).json('your operation was successfully done')
        }).catch(function (err) {
            console.log(err);
            console.log("NO!!!");
            next(new Error(' Somthing Wrong happen please Try aganin'));
        });

    },
    
    async demandSupply(req, res, next){

        console.log("in demandSupply");

        
       

        console.log(req.body)

        if(!req.body.isCancel){

            let allTransactionsItems=[...req.body.items];
            let mainOperationData ={
                from:req.body.from,
                to:req.body.to,
                reference:req.body.reference,
                createdBy:req.user.id,
                operationType:"demandSupply",
            }
            


        

      

      

       let formData={
           from:req.body.from,
           to:req.body.to,
           reference:req.body.reference,
           createdBy:req.user.id,
           related_operation_id:req.body.related_operation_id,
           operationType:"DemandSupply",
           items:req.body.items
       }




           
       const supplySchema=Joi.object({
           from:Joi.number().integer().required(),
           to:Joi.number().integer().disallow(Joi.ref('from')).required(),
           reference: Joi.string().allow(""),
           operationType:Joi.string().allow(""),
           related_operation_id:Joi.number().integer().required(),
           createdBy:Joi.number().integer().required(),
           items: Joi.array().items(Joi.object().keys(
               {product_id:Joi.number().integer().required(),
                item_name:Joi.string(),
                unit:Joi.string(),
                amount:Joi.number().integer().required(),
                count_type: Joi.number().integer().required(),
                track_data:Joi.array().items(Joi.object().keys({
                   track_id:Joi.string().required(),
                   quantity:Joi.number().integer().required(),
                }).when('count_type', { is: 0, then: Joi.optional(), otherwise: Joi.required() })
                )
               }).min(1)).required()
          
           

       })

       const {error} =supplySchema.validate(formData);

      console.error('this is error message',error);

       if(error) {
           return next(error);
       }



        let t;
        
        await sequelize.transaction(async (t) => {
            const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
                next(err);
            });
            if(!newOperation){
                next(new Error(' fast transaction error'));
            }
      
            let length=allTransactionsItems.length;
            let AllExixtBatchTo=[];

          let AllExistSerialFrom=[];

            for(let i=0; i<length;i++){
               let itemData={
                   product_id:allTransactionsItems[i].product_id,
                   quantity:allTransactionsItems[i].amount,
                   stockOperationId:newOperation.operation_id
               }
              
               let newlyCreatedItem= await StockOperationItem.create(itemData,{transaction: t}).catch((err)=>{
                next(err);
             });

     

               if(allTransactionsItems[i].count_type===2 && (allTransactionsItems[i].amount!==0||allTransactionsItems[i].amount!==NaN)){
                console.log('this in count type 1 ')
                let itemBatch =allTransactionsItems[i].track_data;
                const asyncRes = await Promise.all(itemBatch.map(async (d) => {
                await OperationTrackRecord.create({track_id:d.track_id, quantity:d.quantity,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        next(err);
                     });
                const checkDataExistTo=await ProductBatch.findOne({where:{batch_number:d.track_id,location_id:req.body.to}}).catch((err)=>{
                                       next(err);
                           })
                    return checkDataExistTo;
                   }));
               AllExixtBatchTo.push({index:i,array:asyncRes});    
                 
              }
              if(allTransactionsItems[i].count_type===1 && (allTransactionsItems[i].amount!==0||allTransactionsItems[i].amount!==NaN)){
                console.log('this in count type 1 ')
                let itemSerial =allTransactionsItems[i].track_data;
  
                const asyncSerialRes = await Promise.all(itemSerial.map(async (d) => {
  
                    await OperationTrackRecord.create({track_id:d.track_id, quantity:1,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
            
                        next(err);
                     });
  
                    
                    const checkDataExistTo=await ProductSerialised.findOne({where:{serial_number:d.track_id}}).catch((err)=>{
              
                            next(err);
                            })
                 
                     return checkDataExistTo;
  
                    }));
                AllExistSerialFrom.push({index:i,array:asyncSerialRes});   
              
                 
              }
            



            }

      
            
            let promises = [];
            let i=0;


            // let related_exist =await RelatedOperation.findOne({react_id:newOperation.operation_Id},{where:{id:req.body.related_operation_id}} ).catch((err)=>{
            //     next(err);
            //   })    

            
                // console.log('merun ckeck this id',req.body.related_operation_id,newOperation);
                    const newRelatedOperation=await RelatedOperation.update({react_id:newOperation.operation_id,demandStatus:"Done"},{where:{id:formData.related_operation_id,react_id:{[Op.is]: null }},transaction: t} ).catch((err)=>{
                        next(err);
                      })
                    console.log(newRelatedOperation);
            
           

            for ( i; i < allTransactionsItems.length ; i++) {
                    let checkFrom= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.from}}).catch(err => {
                        next(err);
                    })
                    let checkTo= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.to}}).catch(err => {
                        next(err);
                    })
                    console.log('this is check value' ,checkFrom);

                    if(checkFrom){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity - ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.from} ,transaction: t}));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.from,quantity:-allTransactionsItems[i].amount},{transaction: t}))

                    }
                    if(checkTo){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t }));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                    }

                //    if(allTransactionsItems[i].count_type===1){
                //         let trackItemsLength=allTransactionsItems[i].track_data.length;
                //          for (let j =0 ; j<trackItemsLength ; j++){

                //             console.log('seerail numbers',allTransactionsItems[i].track_data[j].track_id);
                         

                //           promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: allTransactionsItems[i].track_data[j].track_id, product_id: allTransactionsItems[i].product_id,location_id:req.body.from}}));
                         
                        
                //         }
                     
                //      }   
           }

           



          
           for(let i=0; i<AllExistSerialFrom.length; i++){
         
            let index=AllExistSerialFrom[i].index;


            for(let j=0; j<AllExistSerialFrom[i].array.length ; j++){
                  let exist=AllExistSerialFrom[i].array[j];

                  console.log('exist serial check',exist);
      
                  let serialNumber=allTransactionsItems[index].track_data[j].track_id;
              
                  let productId= allTransactionsItems[index].product_id;
                  let locationIdTo=req.body.to;
                  let locationIdFrom=req.body.from;
                  

            
                    if(exist){   

                        promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: allTransactionsItems[i].track_data[j].track_id, product_id: allTransactionsItems[i].product_id,location_id:req.body.from},transaction: t}));
                        
              
                      }       
                      else{

                        //not found serial number for transfar in inventory

                     
                        //res.json("give valid Serial  id")
                     
                      }


         
                  
                  

            }

        }

          for(let i=0; i<AllExixtBatchTo.length; i++){
         
              let index=AllExixtBatchTo[i].index;
              for(let j=0; j<AllExixtBatchTo[i].array.length ; j++){
                let exist=AllExixtBatchTo[i].array[j];
                let batchNumber=allTransactionsItems[index].track_data[j].track_id;
                let quantity=  allTransactionsItems[index].track_data[j].quantity ;
                let productId= allTransactionsItems[index].product_id;
                let locationIdTo=req.body.to;
                let locationIdFrom=req.body.from;
                
                 if(exist){   
                     promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity + ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdTo},transaction: t}))
        
                 }       
                 else{
                    promises.push(ProductBatch.create({ batch_number: batchNumber, product_id: productId,location_id:locationIdTo,quantity:quantity},{transaction: t})); 
                 }

                 promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity - ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdFrom},transaction: t}))

                

              }

          }
     
         return  await Promise.all(promises)

        }).then(function (result) {
            console.log("YAY");
            res.status(200).json('your operation was successfully done')
        }).catch(function (err) {
            console.log("NO!!!");
            next(new Error(' something happer in sypply error'));
        });

        }else{

            console.log("is calcle bock")

            let calncleOperationData ={
                from:req.body.from,
                to:req.body.to,
                reference:req.body.reference,
                createdBy:1,
                operationType:"demandSupply",
                releated_operation_id:req.body.releated_operation_id
               
            }

            const cancleSchema=Joi.object({
                from:Joi.number().integer().required(),
                to:Joi.number().integer().disallow(Joi.ref('from')).required(),
                reference: Joi.string().allow(""),
                operationType:Joi.string().allow(""),
                createdBy:Joi.number().integer().required(),
                releated_operation_id:Joi.number().integer().required(),
               
                
    
            })

            const {error} =cancleSchema.validate(calncleOperationData);

            console.error('this is error message',error);
      
             if(error) {
                 return next(error);
             }
      
            let  releated_operation_id=req.body.releated_operation_id;
    
            console.log(releated_operation_id);
    
            await sequelize.transaction(async (t) => {
                const newOperation = await StockOperation.create(calncleOperationData,{transaction: t}).catch((err)=>{
                    next(err);
                });
    
                   return await RelatedOperation.update({react_id:newOperation.operation_id,demandStatus:"rejected"},{where:{id:releated_operation_id,react_id:{[Op.is]: null }},transaction: t} ).catch((err)=>{
                        next(err);
                      })
    
                
    
    
                
                
    
            }).then(function (result) {
                console.log("YAY");
                res.status(200).json('your operation was successfully done')
            }).catch(function (err) {
                console.log(err);
                next(new Error(' something happer in sypply error'));
            });
    

     


        }

    },
 

   
    async supply(req, res, next){
        console.log('this is request form body',req.body);
        
        //next('new error');
        //res.json(req.body);

         let allTransactionsItems=[...req.body.items];
         console.log('all items data check',allTransactionsItems);

        let mainOperationData ={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:req.user.id,
            operationType:"supply",
        }

        let formData={
            from:req.body.from,
            to:req.body.to,
            reference:req.body.reference,
            createdBy:req.user.id,
            operationType:"supply",
            items:req.body.items
        }




            
        const supplySchema=Joi.object({
            from:Joi.number().integer().required(),
            to:Joi.number().integer().disallow(Joi.ref('from')).required(),
            reference: Joi.string().allow(""),
            operationType:Joi.string().allow(""),
            createdBy:Joi.number().integer().required(),
            items: Joi.array().items(Joi.object().keys(
                {product_id:Joi.number().integer().required(),
                 item_name:Joi.string(),
                 unit:Joi.string(),
                 amount:Joi.number().integer().required(),
                 count_type: Joi.number().integer().required(),
                 track_data:Joi.array().items(Joi.object().keys({
                    track_id:Joi.string().required(),
                    quantity:Joi.number().integer().required(),
                 }).when('count_type', { is: 0, then: Joi.optional(), otherwise: Joi.required() })
                 )
                }).min(1)).required()
           
            

        })

        const {error} =supplySchema.validate(formData);

       console.error('this is error message',error);

        if(error) {
            return next(error);
        }

        let t;
        
        await sequelize.transaction(async (t) => {

            


          const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
              t.rollback()
              next(err);
          });
      
          if(!newOperation){
              next(new Error(' fast transaction error'));
          }

          console.log(" operation new data return",newOperation)
          let allItem=[];
          let length=allTransactionsItems.length;
          let AllExixtBatchTo=[];

          let AllExistSerialTo=[];


          for(let i=0; i<length;i++){
             let itemData={
                 product_id:allTransactionsItems[i].product_id,
                 quantity:allTransactionsItems[i].amount,
                 stockOperationId:newOperation.operation_id
            
             }
             allItem.push(itemData);

            let newlyCreatedItem= await StockOperationItem.create(itemData,{transaction: t}).catch((err)=>{
              t.rollback()
              next(err);
           });
      


             if(allTransactionsItems[i].count_type===2){
              
              let itemBatch =allTransactionsItems[i].track_data;
             const asyncRes = await Promise.all(itemBatch.map(async (d) => {
              await OperationTrackRecord.create({track_id:d.track_id, quantity:d.quantity,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                  next(err);
               });
               console.log("im in operation track");
             const checkDataExistTo=await ProductBatch.findOne({where:{batch_number:d.track_id}}).catch((err)=>{
                                     t.rollback()
                                     next(err);
                         })
              
                  return checkDataExistTo;

                 }));
             AllExixtBatchTo.push({index:i,array:asyncRes});    
               
            }

            if(allTransactionsItems[i].count_type===1){
               
              let itemSerial =allTransactionsItems[i].track_data;

              const asyncSerialRes = await Promise.all(itemSerial.map(async (d) => {

                  await OperationTrackRecord.create({track_id:d.track_id, quantity:1,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                      t.rollback()
                      next(err);
                   });

                  
                  const checkDataExistTo=await ProductSerialised.findOne({where:{serial_number:d.track_id}}).catch((err)=>{
                      t.rollback()
                          next(err);
                          })
               
                   return checkDataExistTo;

                  }));
              AllExistSerialTo.push({index:i,array:asyncSerialRes});   
            
               
            }
          }
          //    const allitemCreate=await StockOperationItem.bulkCreate(allItem).catch((err)=>{
          //              next(err);
          //     })

          //     console.log(allitemCreate);
             

          let promises = [];
          let i=0;

          console.log('serali bulk data ',AllExistSerialTo);
          console.log('batch bulk data ',AllExixtBatchTo);

             

          
         

          for ( i; i < allTransactionsItems.length ; i++) {

                  let checkTo= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.to}}).catch(err => {
                      t.rollback()
                      next(err);
                      })

                 

                  if(checkTo){
                      promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t }));

                  }else{
                      promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                  }

                  // if(allTransactionsItems[i].count_type===1){
                  //    let trackItemsLength=allTransactionsItems[i].track_data.length;
                       
                  //     for (let j =0 ; j<trackItemsLength ; j++){
                  //         console.log('in loop');
                  //     promises.push(ProductSerialised.create({ serial_number:allTransactionsItems[i].track_data[j].track_id, product_id: allTransactionsItems[i].product_id,location_id:req.body.to}));
                  //     }
                  
                  // }
                  // else if(allTransactionsItems[i].count_type===2){
                  //     let trackItemsLength=allTransactionsItems[i].track_data.length;
                       
                  //     for (let j =0 ; j<trackItemsLength ; j++){
                  //         console.log('in loop',j);
                  //     promises.push(ProductBatch.create({ batch_number:allTransactionsItems[i].track_data[j].batch, product_id: allTransactionsItems[i].product_id,location_id:req.body.to,quantity:allTransactionsItems[i].track_data[j].quantity}));
                  //     }

                  // }


              
              
           }



           for(let i=0; i<AllExistSerialTo.length; i++){
         
                let index=AllExistSerialTo[i].index;


                for(let j=0; j<AllExistSerialTo[i].array.length ; j++){
                      let exist=AllExistSerialTo[i].array[j];

                      console.log('exist serial check',exist);
          
                      let serialNumber=allTransactionsItems[index].track_data[j].track_id;
                  
                      let productId= allTransactionsItems[index].product_id;
                      let locationIdTo=req.body.to;
                      let locationIdFrom=req.body.from;
                      
                      if(exist){   
                          promises.push(ProductSerialised.update({ location_id:locationIdTo},{where:{serial_number:serialNumber },transaction: t}))
              
                      }       
                      else{
                          promises.push(ProductSerialised.create({ serial_number: serialNumber, product_id: productId,location_id:locationIdTo},{transaction: t})); 
                      }
  
                }
  
            }

        

          


        for(let i=0; i<AllExixtBatchTo.length; i++){
          //   console.log('i',i);
          //   console.log(AllExixtBatchTo);
          //   console.log(AllExixtBatchTo[i].index);
          //   console.log(AllExixtBatchTo[i].array);
            let index=AllExixtBatchTo[i].index;
            for(let j=0; j<AllExixtBatchTo[i].array.length ; j++){
              let exist=AllExixtBatchTo[i].array[j];
              //console.log(exist);
              let batchNumber=allTransactionsItems[index].track_data[j].track_id;
              let quantity=  allTransactionsItems[index].track_data[j].quantity ;
              let productId= allTransactionsItems[index].product_id;
              let locationIdTo=req.body.to;
              let locationIdFrom=req.body.from;
              
               if(exist){   
                   promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity + ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdTo} ,transaction: t}))
      
               }       
               else{
                  promises.push(ProductBatch.create({ batch_number: batchNumber, product_id: productId,location_id:locationIdTo,quantity:quantity},{transaction: t})); 
               }

               promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity - ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdFrom},transaction: t}))

              

            }

        }

  
   
        return await Promise.all(promises)

      //   .then((data) => {
      //     //res.json(200,"now theck this ,this time it might work");
      //    // res.status(200).json('your oppration was succesfull')

      // }).catch((err)=>{
      //     console.log(' error in promise');
      //     t.rollback()
      //     next(err);
      // });

          
      }).then(function (result) {
          console.log("YAY");
          res.status(200).json('your operation was successfully done')
      }).catch(function (err) {
          console.log("NO!!!");
          next(new Error(' Somthing Wrong happen please Try aganin'));
      });

      


    },
    async trash(req, res, next){

        let allTransactionsItems=[...req.body.items];

        console.log('this form items',allTransactionsItems);

       let mainOperationData ={
           from:req.body.from,
           to:req.body.to,
           reference:req.body.reference,
           createdBy:req.user.id,
           operationType:"trash",
       }

       let formData={
           from:req.body.from,
           to:req.body.to,
           reference:req.body.reference,
           createdBy:req.user.id,
           operationType:"trash",
           items:req.body.items
       }




           
       const supplySchema=Joi.object({
           from:Joi.number().integer().required(),
           to:Joi.number().integer().disallow(Joi.ref('from')).required(),
           reference: Joi.string().allow(""),
           operationType:Joi.string().allow(""),
           createdBy:Joi.number().integer().required(),
           items: Joi.array().items(Joi.object().keys(
               {product_id:Joi.number().integer().required(),
                item_name:Joi.string(),
                unit:Joi.string(),
                amount:Joi.number().integer().required(),
                count_type: Joi.number().integer().required(),
                track_data:Joi.array().items(Joi.object().keys({
                   track_id:Joi.string().required(),
                   quantity:Joi.number().integer().required(),
                }).when('count_type', { is: 0, then: Joi.optional(), otherwise: Joi.required() })
                )
               }).min(1)).required()
          
           

       })

       const {error} =supplySchema.validate(formData);

      console.error('this is error message',error);

       if(error) {
           return next(error);
       }



        let t;
        
        await sequelize.transaction(async (t) => {
            const newOperation = await StockOperation.create(mainOperationData,{transaction: t}).catch((err)=>{
                next(err);
            });
            if(!newOperation){
                next(new Error(' fast transaction error'));
            }
      
            let length=allTransactionsItems.length;
            let AllExixtBatchTo=[];

          let AllExistSerialFrom=[];

            for(let i=0; i<length;i++){
               let itemData={
                   product_id:allTransactionsItems[i].product_id,
                   quantity:allTransactionsItems[i].amount,
                   stockOperationId:newOperation.operation_id
               }
              
               let newlyCreatedItem= await StockOperationItem.create(itemData,{transaction: t}).catch((err)=>{
                t.rollback()
                next(err);
             });

               if(allTransactionsItems[i].count_type===2){
                 
                let itemBatch =allTransactionsItems[i].track_data;
                const asyncRes = await Promise.all(itemBatch.map(async (d) => {
                await OperationTrackRecord.create({track_id:d.track_id, quantity:d.quantity,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        next(err);
                     });
                const checkDataExistTo=await ProductBatch.findOne({where:{batch_number:d.track_id,location_id:req.body.to}}).catch((err)=>{
                                       next(err);
                           })
                    return checkDataExistTo;
                   }));
               AllExixtBatchTo.push({index:i,array:asyncRes});    
                 
              }
              if(allTransactionsItems[i].count_type===1){
               
                let itemSerial =allTransactionsItems[i].track_data;
  
                const asyncSerialRes = await Promise.all(itemSerial.map(async (d) => {
  
                    await OperationTrackRecord.create({track_id:d.track_id, quantity:1,item_operation_id:newlyCreatedItem.id},{transaction: t}).catch((err)=>{
                        t.rollback()
                        next(err);
                     });
  
                    
                    const checkDataExistTo=await ProductSerialised.findOne({where:{serial_number:d.track_id}}).catch((err)=>{
                        t.rollback()
                            next(err);
                            })
                 
                     return checkDataExistTo;
  
                    }));
                AllExistSerialFrom.push({index:i,array:asyncSerialRes});   
              
                 
              }
            



            }

      
            
            let promises = [];
            let i=0;


            

      
           

            for ( i; i < allTransactionsItems.length ; i++) {
                    let checkFrom= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.from},transaction: t}).catch(err => {
                        next(err);
                    })
                    let checkTo= await Inventory.findOne({where:{ product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t}).catch(err => {
                        next(err);
                    })
                    console.log('this is check value' ,checkFrom);

                    if(checkFrom){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity - ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.from} ,transaction: t}));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.from,quantity:-allTransactionsItems[i].amount},{transaction: t}))

                    }
                    if(checkTo){
                        promises.push(Inventory.update({ quantity:  sequelize.literal(`quantity + ${allTransactionsItems[i].amount}`)},{ where: { product_id: allTransactionsItems[i].product_id,location_id: req.body.to},transaction: t }));

                    }else{
                        promises.push( Inventory.create({ product_id: allTransactionsItems[i].product_id,location_id: req.body.to,quantity:allTransactionsItems[i].amount},{transaction: t}))

                    }

                //    if(allTransactionsItems[i].count_type===1){
                //         let trackItemsLength=allTransactionsItems[i].track_data.length;
                //          for (let j =0 ; j<trackItemsLength ; j++){

                //             console.log('seerail numbers',allTransactionsItems[i].track_data[j].track_id);
                         

                //           promises.push(ProductSerialised.update({ location_id:req.body.to},{ where: { serial_number: allTransactionsItems[i].track_data[j].track_id, product_id: allTransactionsItems[i].product_id,location_id:req.body.from}}));
                         
                        
                //         }
                     
                //      }   
           }

           



          
           for(let i=0; i<AllExistSerialFrom.length; i++){
         
            let index=AllExistSerialFrom[i].index;


            for(let j=0; j<AllExistSerialFrom[i].array.length ; j++){
                  let exist=AllExistSerialFrom[i].array[j];

                  console.log('exist serial check',exist);
      
                  let serialNumber=allTransactionsItems[index].track_data[j].track_id;
              
                  let productId= allTransactionsItems[index].product_id;
                  let locationIdTo=req.body.to;
                  let locationIdFrom=req.body.from;
                  

            
                    if(exist){   

                        promises.push(ProductSerialised.update({ location_id:locationIdTo},{ where: { serial_number: serialNumber, product_id: productId,location_id:locationIdFrom},transaction: t}));
                        
              
                      }       
                      else{

                        //not found serial number for transfar in inventory

                     
                        //res.json("give valid Serial  id")
                     
                      }


         
                  
                  

            }

        }

          for(let i=0; i<AllExixtBatchTo.length; i++){
         
              let index=AllExixtBatchTo[i].index;
              for(let j=0; j<AllExixtBatchTo[i].array.length ; j++){
                let exist=AllExixtBatchTo[i].array[j];
                let batchNumber=allTransactionsItems[index].track_data[j].track_id;
                let quantity=  allTransactionsItems[index].track_data[j].quantity ;
                let productId= allTransactionsItems[index].product_id;
                let locationIdTo=req.body.to;
                let locationIdFrom=req.body.from;
                
                 if(exist){   
                     promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity + ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdTo},transaction: t}))
        
                 }       
                 else{
                    promises.push(ProductBatch.create({ batch_number: batchNumber, product_id: productId,location_id:locationIdTo,quantity:quantity},{transaction: t})); 
                 }

                 promises.push(ProductBatch.update({ quantity:sequelize.literal(`quantity - ${quantity}`)},{where:{batch_number:batchNumber, product_id: productId,location_id:locationIdFrom},transaction: t}))

                

              }

          }
     
         return  await Promise.all(promises)

        }).then(function (result) {
            console.log("YAY");
            res.status(200).json('your operation was successfully done')
        }).catch(function (err) {
            console.log(err);
            next(new Error(' something happer in sypply error'));
        });

    },

   

    async inventory(req, res, next){

        console.log("all inventory ");
        try{

            const exist = await Inventory.findAll({
                raw: true,
                attributes: [['quantity','amount']],
                include: [{
                    model: Location ,
                    attributes: ['name'],
                   // where: {location_id:2},
                    raw: true,
                    include:
                            {
                                model: LocationType,
                                attributes: ['name'],
                              
                                // include: {
                                //     model: Product,
                                //     include: {
                                //          model: Units,
                
                                //          }
                                    
                                    
                                // },
                                
                                //attributes:['name'],
                                
                                
                                required: false,     
                            },
                           
                        
                            
                        
                group: ['name'],
                required: false,
                    
                },
                {
                    model: Product,
                    attributes: ['name'],
                    include: {
                         model: Units,
                         attributes: ['name']

                         }
                    
                    
                }
            
            
            ],
            
            });

            if(!exist){
                res.json("transaction not found")
            }
            res.json(exist);

        }catch(err){
            next(err);
        }
    },
    async viewAllReleted(req, res, next){

      
        try{

            const exist = await RelatedOperation.findAll({
               
                include: [{
                    model: StockOperation ,
                    as:'act',
                    include:[
                            {
                                model: StockOperationItem,
                                include:{
                                    model:Product,
                                    include:{
                                        model: Units
                                    }
                                },
                                
                                required: false,     
                            },
                            {

                                model:Location,
                                attributes:['name'],
                                as:'From'
                                
                                
                            },{
            
                                model:Location,
                                attributes:['name'],
                                as:'To'
                                
                                
                            }
                        ],
                           
                        
                            
             
                required: false,
                    
                },
                {
                    model: StockOperation ,
                    as:'react',
                    include: {
                         model: StockOperationItem,
                         include:{
                            model:Product,
                            include:{
                                model: Units
                            }
                        },
                         required: false,    

                         }
                    
                    
                }
            
            
            ],
            
            });

            if(!exist){
                res.json("transaction not found")
            }
            res.json(exist);

        }catch(err){
            next(err);
        }
    },
    async  viewSingleReleted(req, res, next){
        let id = req.params.id;
 
        try{

            const exist = await RelatedOperation.findOne({
               where: {id:id},
                include: [{
                    model: StockOperation ,
                    as:'act',
                    include:[
                            {
                                model: StockOperationItem,
                                include:{
                                    model:Product,
                                    include:{
                                        model: Units
                                    }
                                },
                                
                                required: false,     
                            },
                            {

                                model:Location,
                                attributes:['name'],
                                as:'From'
                                
                                
                            },{
            
                                model:Location,
                                attributes:['name'],
                                as:'To'
                                
                                
                            }
                        ],
                           
                        
                            
             
                required: false,
                    
                },
                {
                    model: StockOperation ,
                    as:'react',
                    include: {
                         model: StockOperationItem,
                         include:{
                            model:Product,
                            include:{
                                model: Units
                            }
                        },
                         required: false,    

                         }
                    
                    
                }
            
            
            ],
            
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

export default stockOperationController;