'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
import {useForm} from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { motion, AnimatePresence } from 'framer-motion';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#18181b] font-sora overflow-hidden">
      {/* SVG starfield background (matches sign-in page) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <svg className="absolute inset-0 w-full h-full" style={{zIndex:0}}>
          {[...Array(120)].map((_,i) => (
            <circle key={i} cx={Math.random()*100+'%'} cy={Math.random()*100+'%'} r={Math.random()*1.2+0.2} fill="#fff" opacity={Math.random()*0.7+0.2} />
          ))}
        </svg>
      </div>
      {/* Main Card */}
      <motion.div
        className="relative w-full max-w-4xl px-6 py-8 md:px-12 md:py-12 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-transparent bg-clip-padding flex flex-col gap-8 items-center"
        style={{ borderImage: 'linear-gradient(120deg, #e0c3fc 10%, #ffe5d0 50%, #8ec5fc 90%) 1' }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center tracking-tight leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >✨ User Dashboard</motion.h1>
        <div className="w-full flex flex-col gap-4">
          <label className="text-base md:text-lg font-semibold text-white/90 mb-1 flex items-center gap-2">
            <span>📎 Copy Your Unique Link</span>
          </label>
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={profileUrl}
              disabled
              readOnly
              className="w-full bg-white/10 border border-white/30 text-white/90 rounded-xl px-4 py-2 font-sora text-sm focus:outline-none focus:ring-2 focus:ring-[#e0c3fc] transition-all duration-200 shadow-inner backdrop-blur placeholder:text-white/60 select-all cursor-pointer ring-1 ring-inset ring-[#e0c3fc]/30"
            />
            <Button onClick={copyToClipboard} className="ml-1 px-4 py-2 rounded-xl font-semibold text-[#7b61ff] bg-gradient-to-r from-[#e0c3fc] via-[#ffe5d0] to-[#8ec5fc] hover:from-[#ffe5d0] hover:to-[#e0c3fc] shadow-lg border-0 transition-all duration-200 focus:ring-2 focus:ring-[#e0c3fc] focus:outline-none">
              Copy
            </Button>
          </div>
        </div>
        <div className="w-full flex items-center justify-between gap-4 mt-2">
          <label className="flex items-center gap-2 text-white/90 font-medium text-base">
            <span>🔘 Accept Messages</span>
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-[#8ec5fc] data-[state=unchecked]:bg-white/20 transition-colors duration-200 border border-white/30 rounded-full shadow-inner focus:ring-2 focus:ring-[#e0c3fc]"
            />
          </label>
        </div>
        <Separator className="w-full bg-white/20 h-0.5 rounded-full my-2" />
        <Button
          className="w-full mt-2 bg-gradient-to-r from-[#e0c3fc] via-[#ffe5d0] to-[#8ec5fc] hover:from-[#ffe5d0] hover:to-[#e0c3fc] text-[#7b61ff] font-semibold rounded-xl px-7 py-2 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border-0 text-base focus:ring-2 focus:ring-[#e0c3fc] focus:outline-none"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh Messages
        </Button>
        <div className="w-full flex flex-col items-center justify-center min-h-[80px] mt-4">
          <AnimatePresence>
            {messages.length > 0 ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={String(message._id)}
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ scale: 1.01, boxShadow: '0 2px 24px 0 #00000033', border: '2px solid #000', background: 'rgba(255,255,255,0.7)' }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.08, ease: 'easeOut' }}
                    exit={{ opacity: 0, y: 40 }}
                  >
                    <MessageCard
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/70 italic font-sora text-lg text-center">💬 No messages to display.</motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default UserDashboard;
