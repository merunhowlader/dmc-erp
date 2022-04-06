import Joi from 'joi';
import { Product,ProductAttribute,Units,Category,Sequelize,ProductExperation,ProductSerialised,ProductBatch,Location, Inventory} from '../../models';
import moment from 'moment';




import CustomErrorHandler from '../../services/CustomErrorHandler';

const { Op } = Sequelize;
const productController ={
   async store(req, res, next){
    try{

        const exist = await Product.findAll().catch((err)=>{
            return next(err);
        })
      
        res.json(exist);
        
  
      }catch(err){
          next(err);
        }
    //res.json("hi");



   

    },

    async getProducts (req,res, next){
        try{

            const exist = await Product.findAll(
                {
               
                attributes: [['product_id','id'], ['name', 'title'],'count_type','sku','root'],
                include:[
                {
                    model: Category,
                    required: false,   
                }
                 ,
                {
                    model: Units,
                    attributes:['name'],
                  
                    required: false, 
                },
                {
                    model: Location,
                  
                  
                    required: false, 
                },
                {
                    model: Inventory,
                   
                  
                    required: false, 
                },
            ], 
                required: false, 
                
            }).catch((err)=>{
                return next(err);
            })

      

            //let result =await Product.findAll();
          
            res.json(exist);
            
      
          }catch(err){
              next(err);
            }

    },

    async addProduct(req, res, next){

    
        let product ={
            name:req.body.name,
            unit_id:req.body.unit_id,
            count_type:req.body.count_type,
            category_id:req.body.category_id,
            root:req.body.product_location,
            sku:req.body.sku,
            price:req.body.price,
            returnable_product:req.body.returnable_product
           
        }

        const productSchema=Joi.object({
            name:Joi.string().required(),
            unit_id:Joi.number().integer().required(),
            count_type: Joi.number().integer().required(),
            category_id:Joi.number().integer(),
            root:Joi.number().integer().required(),
            sku:Joi.string().required(),
            price:Joi.any(),
            returnable_product:Joi.boolean().required(),
 
        })
 
        const {error} =productSchema.validate(product);
 
       console.error('this is error message',error);
 
        if(error) {
            return next(error);
        }
 


    

        

        try{
      

            const alreadyExist = await Product.findOne({where:{[Op.or]:[{name: req.body.name },{sku:product.sku}]}}).catch((err)=>{
                 
                next(err);
            });

            if(alreadyExist){
                res.json('product already exists')
            }else{

            //await Product.create(product);

            const newProduct = await Product.create(product).catch((err)=>{
                 
                next(err);
            });
        
            if(!newProduct){
                next(new Error(' product error'));
            }


            
               if(newProduct){

                let attributes ={
                  
                    notice:req.body.notice_amount,
                    image:req.body.image,
                    description:req.body.description,
                    product_id:newProduct.product_id,
                    created_by:1
                }

                const newAttribute = await ProductAttribute.create(attributes).catch((err)=>{
                     
                    next(err);
                });
                res.json('new product added')
               }
            

            }  
      
          }catch(err){
              next(err);
            }
        //res.json(" get all products");
    },
    
     
    async getUnit (req, res, next){
        try{
    
            const exist = await Units.findAll().catch((err)=>{
                return next(err);
            })
          
            res.json(exist);
            
      
          }catch(err){
              next(err);
            }
        //res.json("hi");
    
    
    
       
    
        },

    async addUnit(req, res, next){

        let unit ={
            name:req.body.name,
           
            
           
        }

        

        try{

            //await Product.create(product);

            const exist = await Units.findOne({where:{name:req.body.name}});

            if(exist){
                return next(CustomErrorHandler.alreadyExist('category already exists'));

            }

            const newUnit= await Units.create(unit).catch((err)=>{
                 
                next(err);
            });

            res.json(newUnit);
        
         
            

                
      
          }catch(err){
              next(err);
            }
        //res.json(" get all products");
    },
    
 
    async getCategory (req, res, next){
        try{
    
            const exist = await Category.findAll().catch((err)=>{
                return next(err);
            })
          
            res.json(exist);
            
      
          }catch(err){
              next(err);
            }
        //res.json("hi");
    
    
    
       
    
        },

    async addCategory(req, res, next){

        let category ={
            name:req.body.name,
           
            
           
        }

        

        try{

            //await Product.create(product);

            const exist = await Category.findOne({where:{name:req.body.name}});

            if(exist){
                return next(CustomErrorHandler.alreadyExist('category already exists'));

            }

            const newCategory = await Category.create(category).catch((err)=>{
                 
                next(err);
            });

            res.json(newCategory);
        
         
            

                
      
          }catch(err){
              next(err);
            }
        //res.json(" get all products");
    },

    async getAll(req, res, next){
        try{

            const exist = await Product.findAll(
                {
               
                attributes: [['product_id','id'], ['name', 'title'],'count_type'],
                include:[{
                       model: ProductAttribute,
                       
                       include:{
                        model: Category,
                        //right: true ,
            
                        required: false,     
                         },
                
                       required: false, 

                },
                {
                    model: Units,
                    right: true ,
                    attributes:['name'],
                  
                    required: false, 
                },

            
            
            
            
            
            ],
                
                required: false,
                
                
            }).catch((err)=>{
                
                return next(err);
            })

           
          
            res.json(exist);
            
      
          }catch(err){
              next(err);
            }
        //res.json(" get all products");
    },
   
    async  getTrackingNumber(req, res, next){

        try{

          

                const serialExist = await  ProductSerialised.findAll({
               
                }).catch((err)=>{
                 
                    next(err);
                });

              

              

           
                const BatchExist = await ProductBatch.findAll({
               
    
              
                    
                }).catch((err)=>{
                 
                    next(err);
                });

               res.json({"serialNumber":serialExist,"batchNumber":BatchExist})









               

        

        }catch(err){
            next(err);
          }
        
    },
    async addTrackingNumber(req, res, next){



        try{

            if(req.body.count_type===1){
                let data={
                    serial_number:req.body.track_id,
                    product_id:req.body.product_id,
                    location_id:req.body.to
                }

                const serialExist = await ProductSerialised.findOne({where:{serial_number:data.serial_number,product_id:data.product_id}}).catch((err)=>{
                 
                    next(err);
                });

                if(serialExist){
                    res.json({message:'serial already exist'})
                }else{
                    const newProductSerial = await ProductSerialised.create(data).catch((err)=>{
                     
                        next(err);
                    });

                    res.json(newProductSerial)

                }



              

            }
            else if(req.body.count_type===2){
                let data={
                    batch_number:req.body.track_id,
                    product_id:req.body.product_id,
                    location_id:req.body.to,
                    quantity:req.body.quantity
                }

                const serialExist = await ProductBatch.findOne({where:{batch_number:data.batch_number,product_id:data.product_id}}).catch((err)=>{
                 
                    next(err);
                });

                if(serialExist){
                    res.json({message:'batch already exist'})
                }else{
                    const newProductBatch = await ProductBatch.create(data).catch((err)=>{
                     
                        next(err);
                    });
                    res.json(newProductBatch)

                }



               

            }else{

                res.json({message:'something wrong happen '})

            }
            

        

        }catch(err){
            next(err);
          }
        
    },
    async addProductExperations(req, res, next){

        let newDate=req.body.date;

        let expdate= moment(newDate);


        let productId=req.body.product_id;
        let trackID=req.body.track_id;
        let count_type=req.body.count_type;
 
        let formData={
            expdate,
            productId,
            trackID,
            count_type,
            expdate
        }

        const exparySchema=Joi.object({
            productId:Joi.number().integer().required(),
            trackID: Joi.string().required(),
            count_type: Joi.number().integer().required(),
            expdate:Joi.required(),
            
            

        })

        const {error} =exparySchema.validate(formData);

       console.error('this is error message',error);

        if(error) {
            return next(error);
        }

        try{
            if(req.body.count_type===1){
                await ProductSerialised.update({experyDate:expdate},{where:{product_id:productId,serial_number:trackID}}).catch(err=>{
                    next(err);
                })

                    res.json("experation data was added successfully")

               
    
            }else if(req.body.count_type===2){

                await ProductBatch.update({experyDate:expdate},{where:{product_id:productId,batch_number:trackID}}).catch(err=>{
                 next(err);
                })

                res.json("experation data was added successfully")
                
            }else{




                res.json("nonserialise are not allowed")
            
            }
            
          

          }catch(err){
              next(err);
            }
        
    },

    async getProductExperation(req, res, next){

        try{
            // const serialisedExperation = await ProductExperation.findAll({where:{table_name: 'productBatch'},include:{
            //     model: ProductBatch ,
            //     include:Product
            //  }});

            const serialisedExperation = await Product.findAll({where:{count_type: 2},include:{
                model: ProductBatch ,
                include:{
                    model:ProductExperation,
                    where:{table_name: 'productBatch'}
                }
             }});


             const BatchExperation = await ProductExperation.findAll({where:{table_name: 'productSerialised'},include:{
                model: ProductSerialised,
                include:Product
             }});

             res.json({'seralised_experation':serialisedExperation, 'batch_experation':BatchExperation});
         
           

        }catch(err){
            next(err);
        }

        
      
    }



}

export default productController;