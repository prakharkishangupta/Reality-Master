import NextAuth, { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface User{
        userName?: string;
        isVerified?: boolean;
        _id?: string;
        isAcceptingMessages?: boolean
    }

    interface Session{
        user:{
            userName?: string;
            isVerified?: boolean;
            _id?: string;
            isAcceptingMessages?: boolean 
        }& DefaultSession['user']
    }
}
declare module 'next-auth/jwt' {
    interface JWT{
        userName?: string;
        isVerified?: boolean;
        _id?: string;
        isAcceptingMessages?: boolean
    }
}