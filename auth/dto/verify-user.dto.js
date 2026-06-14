const { default: z } = require("zod");

const verifyUserSchema = z.object({
    email: z.email(),
    otp: z.string().length(6),
})

module.exports = verifyUserSchema
