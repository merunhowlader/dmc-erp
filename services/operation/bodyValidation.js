
import Joi from 'joi';
class bodyValidation{
    static  distribution(formData){
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

        return error;
    }
   
}

export default bodyValidation;