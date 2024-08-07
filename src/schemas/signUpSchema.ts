import { z } from "zod";
export const userNameValidation = z.string().min(3, {message:"at least 6 characters required"})
                                    .max(20, {message:"maximum 20 characters allowed"})
                                    .regex(/^[a-zA-Z0-9_]+$/, "please don't use specal characters")

export const signUpSchema = z.object({
    userName: userNameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(6, {message:"password must be at least 6 characters"})
})                                    