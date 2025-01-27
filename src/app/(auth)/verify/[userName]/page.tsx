'use client';


import { zodResolver } from "@hookform/resolvers/zod"
import * as z  from "zod"
import axios from "axios";
import { verifySchema } from "@/schemas/verifySchema";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";


export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{userName:string}>()
    const {toast} = useToast();
    const form = useForm<z.infer<typeof verifySchema>> ({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>)=>{
        
        try {
            const response = await axios.post('/api/verify-code', {
                userName : params.userName,
                code : data.code
           })
           toast({
            title: "Success",
            description: "response.data.message"
           })
           router.replace('sign-in');
        } catch (error) {
            console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            // Default error message
            let errorMessage = axiosError.response?.data.message;
            ('There was a problem with your sign-up. Please try again.');

            toast({
                title: 'OTP verification Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify Your Account
              </h1>
              <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Verify</Button>
              </form>
            </Form>
          </div>
        </div>
      );
}


