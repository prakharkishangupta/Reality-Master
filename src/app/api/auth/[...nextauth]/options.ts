import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          id: "Credentials",
          name: "Credentials",
          
          credentials: {
            email: { label: "Email", type: "text", placeholder: "xyz@gmail.com" },
            password: { label: "Password", type: "password" }
          },

          async authorize(credentials:any): Promise<any> {

            await dbConnect();

            try {
                const user = await UserModel.findOne({
                    $or:[
                        {email: credentials.identifier.email},
                        {userName: credentials.identifier}
                    ]
                })
                if(!user){
                    throw new Error("User not found");
                }

                if(!user.isVerified){
                    throw new Error("Please verify your email");
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                if(isPasswordCorrect){
                    return user;
                }
                else{
                    throw new Error("Please enter valid password");
                }
                
            } catch (err: any) {
                throw new Error(err);
            }
          }
        })
        
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user.userName = token.userName;
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
          return session;
        },
        async jwt({ token, user }) {
            if(user){
                token.userName = user.userName;
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
          return token;
        }
    
    },
    pages: {
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET_KEY,
}