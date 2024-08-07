import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import {z} from "zod";

const UserNameQuerySchema = z.object({
    userName: userNameValidation
})

export async function GET(request: Request){
    await dbConnect();
        
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            userName: searchParams.get('userName')
        }
        const result = UserNameQuerySchema.safeParse(queryParam);
        console.log(result);
        if(!result.success){
            const resultError = result.error.format().userName?._errors || [];
            return Response.json({
                success:false,
                message: resultError?.length > 0 
                ?resultError?.join(', ')
                :"Invalid query parameters"
            }, {status:400})
        }
        const {userName} = result.data;
        const existingUser = await UserModel.findOne({
            userName,
            isVerified:true
        })
        if(existingUser){
            return Response.json({
                success:false,
                message: "User name already taken"
            }, {status:400})
        }
        return Response.json({
            success:true,
            message: "Username is unique"
        }, {status:400})
    } catch (error) {
        return Response.json({
            success: false,
            message: "User name is not available"
        },{status:500})
    }
}