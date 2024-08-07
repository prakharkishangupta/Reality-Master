import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {userName, email, password} = await request.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({
            userName,
            isVerified: true
        })
        const existingVerifiedUserByemail = await UserModel.findOne({
            email,
            isVerified: true
        })
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        if(existingVerifiedUserByUsername){
            return Response.json({success: false, message:"User name already exist"},{ status: 400});
        }
        if(existingVerifiedUserByemail){
            if(existingVerifiedUserByemail.isVerified){
                return Response.json({success: false, message:"User with this email already exist."},{ status: 500});
            }
            else{
                const hasedPassword = await bcrypt.hash(password, 10);
                existingVerifiedUserByemail.password = hasedPassword;
                existingVerifiedUserByemail.verifyCode = verifyCode;
                existingVerifiedUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingVerifiedUserByemail.save();
            }
        }
        
        else{
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                userName,
                email,
                password: hasedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save();
            
        }
        const emailResponse = await sendVerificationEmail(email, userName, verifyCode);
        if(!emailResponse.success){
            return Response.json({success: false, message:"emailResponse.message"},{ status: 500});
        }
        return Response.json({success: true, message:"User registered successfully. Please verify your email."},{ status: 201});
    } catch (error) {
        console.log("Eroor in registering");
        return Response.json({success:false, message:"Eroor in user registration"},{status:500})
    }
}