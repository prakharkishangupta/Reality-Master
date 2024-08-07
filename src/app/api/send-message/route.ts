import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

    const {userName, content} = await request.json();

    const user = await UserModel.findOne(userName);
    if(!user){
        return Response.json({
            success:false,
            message: "User not found"
        }, {status:400})
    }
    const newMessage = {content, createdAt: new Date()};
    user.messages.push(newMessage as Message);
    return Response.json({
        success:true,
        message: "Message sent successfully"
    }, {status:200})
}