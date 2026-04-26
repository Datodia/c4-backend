const { default: z } = require("zod");

const signInUserSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
})

module.exports = signInUserSchema