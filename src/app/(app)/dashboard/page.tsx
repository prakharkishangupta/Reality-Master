'use client'

import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { ApiResponse } from '@/types/ApiResponse';
import axios from 'axios';
  
const Dashboard = () => {
  const [message, setMessage] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const {toast} = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessage(message.filter((message)=> message._id !== messageId))
  }
  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const {register, watch, setValue} = form;

  const acceptMessage = watch('acceptMessage');

  const fetchAcceptMessage = useCallback(
    async () => {
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/accept-message')
        setValue('acceptMessage', response.data.isAcceptingMessages);
      } catch (error) {
        
      }
    },
    [setValue],
  ); 

  

  return (
    <div>
     
    </div>
  );
}

export default Dashboard;
