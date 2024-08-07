import { z  } from "zod";

export const messageSchema = z.object({
    context: z.string().min(10, {message: "context must be of at least 10 characters"}).max(300, {message:"context must be less than 300 characters"}),
    password: z.string()
})