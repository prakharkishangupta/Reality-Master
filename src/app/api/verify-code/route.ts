import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect();

    try {
        const {userName, code} = await request.json();
        console.log(userName, code);
        const existUser = await UserModel.findOne({userName});
        if(!existUser){
            return Response.json({
                success:false,
                message: "User name does not exist"
            }, {status:400})
        }
        const isCodeValid = existUser.verifyCode === code;
        const isCodeNotExpired = new Date(existUser.verifyCodeExpiry) > new Date();
        if(isCodeValid && isCodeNotExpired ){
            existUser.isVerified = true;
            await existUser.save();
            return Response.json({
                success:true,
                message: "Account verified"
            }, {status:200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message: "Code expired , please sign-up again"
            }, {status:400})
        }
        else{
            return Response.json({
                success:false,
                message: "Verification code is invalid"
            }, {status:400})
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json({
            success:false,
            message: "User verify code error"
        }, {status:500})
    }
}