import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'AnoMess Verification code',
            react: VerificationEmail({userName, otp: verifyCode}),
          });
        return {success:true, message: "Successfully send varification email"};
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {success:false, message: "Failed to send varification email"}
    }
}