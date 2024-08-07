import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    console.log(session);
    console.log(session?.user);

    if(!session || !user){
        return Response.json({
            success:false,
            message: "Not authenticated"
        }, {status:401})
    }

    const {acceptMessage} = await request.json();
    const userId = user._id;
    try {
        const updatedUser = UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessages: acceptMessage
            
        },{new:true});
        if(!updatedUser){
            return Response.json({
                success:false,
                message: "User not available to update acceptance of message",
                updatedUser
            }, {status:400})
        }
        return Response.json({
            success:true,
            message: "User updated for accepting message successfully"
        }, {status:200})
    } catch (error) {
        console.log("Error in accepting message authentication");
        return Response.json({
            success:false,
            message: "Error in accepting message authentication"
        }, {status:500})
    }
}


export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    console.log(session);
    console.log(session?.user);

    if(!session || !user){
        return Response.json({
            success:false,
            message: "Not authenticated"
        }, {status:401})
    }

    const userId = user._id;
    const foundUser = await UserModel.findById(userId);
    try {
        

        if(!foundUser){
            return Response.json({
                success:false,
                message: "User not found"
            }, {status:401})
        }
        return Response.json(
            {
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error retrieving message acceptance status:', error");
        return Response.json({
            success:false,
            message: "Error retrieving message acceptance status:', error"
        }, {status:500})
    }
}
