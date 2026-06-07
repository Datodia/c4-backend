const { default: z } = require("zod");


const productSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().positive(),
    desc: z.string().optional(),
    review: z.number().optional()    
})

module.exports = productSchema