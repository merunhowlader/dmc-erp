import Joi from 'joi';
import { Product,ProductAttribute,Units,Category,ProductExperation,ProductSerialised,ProductBatch,Location, Inventory} from '../../models';
import crypto from 'crypto'; 





import CustomErrorHandler from '../../services/CustomErrorHandler';
import { Sequelize } from 'sequelize';
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

            console.log(exist);

            //let result =await Product.findAll();
          
            res.json(exist);
            
      
          }catch(err){
              next(err);
            }

    },

    async addProduct(req, res, next){

        let newSku=req.body.name.slice(0,4)+crypto.randomBytes(4).toString("hex");

        crypto.randomUUID


        // if(req.body.sku){
        //     newSku=req.body.sku;
        // }
        console.log(req.body);
        let product ={
            name:req.body.name,
            unit_id:req.body.unit_id,
            quantity:req.body.quantity,
            count_type:req.body.count_type,
            category_id:req.body.category_id,
            root:req.body.product_location,
            sku:newSku,
            price:req.body.price,
            returnable_product:req.body.returnable_product
           
        }


    

        

        try{

            const alreadyExist = await Product.findOne({where: {name: req.body.name }}).catch((err)=>{
                 
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
                console.log(err);
                return next(err);
            })

            console.log(exist);
          
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

       
         console.log(req.body.date);
        let neExp=req.body.date.toString();
        let birthday = new Date(req.body.date.toString())
        let expdate=new Date();

        console.log(neExp);
        let data ={
            date:expdate,
         
            table_name:(req.body.count_type===1) ? "productSerialised" : "productBatch",
            //track_id:req.body.track_id,
            
           
        }

        

        try{
              const newProductExperation = await ProductExperation.create(data).then((d) =>{
                    res.json(d)
                }).catch((err)=>{
                 
                    next(err);
                });

          

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