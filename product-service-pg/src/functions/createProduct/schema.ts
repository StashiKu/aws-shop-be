import * as Joi  from 'joi';

export const schema = Joi.object({
    description: Joi.string().min(3).required(),
    title: Joi.string().min(1).required(),
    price: Joi.number().required(),
    count: Joi.number().required(),
    id: Joi.string()
});
