'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace("/sign-in");

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Nebula/Starfield Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[650px] sm:h-[650px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-green-600/60 via-green-700/40 to-transparent blur-2xl opacity-70" />
        <svg className="absolute inset-0 w-full h-full" style={{zIndex:0}}>
          {[...Array(120)].map((_,i) => (
            <circle key={i} cx={Math.random()*100+'%'} cy={Math.random()*100+'%'} r={Math.random()*1.2+0.2} fill="#fff" opacity={Math.random()*0.7+0.2} />
          ))}
        </svg>
      </div>
      {/* Purple Glow Behind Card - now more visible */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[650px] sm:h-[650px] md:w-[800px] md:h-[800px] rounded-3xl pointer-events-none animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.55) 0%, rgba(34,197,94,0.32) 60%, transparent 100%)', filter: 'blur(64px)' }}
      />
      {/* Centered Card */}
      <motion.div
        className="relative z-20 w-full max-w-xs sm:max-w-sm md:max-w-md px-4 sm:px-8 py-6 sm:py-8 bg-[#181926]/95 rounded-2xl shadow-2xl border border-[#22c55e]/20 backdrop-blur-xl flex flex-col gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 sm:mb-4">Join Maskd</h1>
          <p className="mb-2 sm:mb-4 text-gray-300 text-sm sm:text-base">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Username</FormLabel>
                  <Input
                    {...field}
                    className="bg-[#23242a] border border-[#23242a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30 text-white placeholder-gray-400 rounded-lg py-3"
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin text-blue-400" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <Input {...field} name="email" className="bg-[#23242a] border border-[#23242a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30 text-white placeholder-gray-400 rounded-lg py-3" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <Input type="password" {...field} name="password" className="bg-[#23242a] border border-[#23242a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30 text-white placeholder-gray-400 rounded-lg py-3" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg shadow py-3 transition-all duration-200' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-2">
          <p className="text-gray-400">
            Already Have An Account?{' '}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 underline">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
      <style jsx global>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-glow-pulse {
          animation: glow-pulse 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

