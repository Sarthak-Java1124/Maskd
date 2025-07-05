'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { motion } from 'framer-motion';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Nebula/Starfield Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-purple-700/60 via-blue-700/40 to-transparent blur-2xl opacity-70" />
        <svg className="absolute inset-0 w-full h-full" style={{zIndex:0}}>
          {[...Array(120)].map((_,i) => (
            <circle key={i} cx={Math.random()*100+'%'} cy={Math.random()*100+'%'} r={Math.random()*1.2+0.2} fill="#fff" opacity={Math.random()*0.7+0.2} />
          ))}
        </svg>
      </div>
      {/* Purple Glow Behind Card */}
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 sm:mb-4">Welcome Back to Maskd</h1>
          <p className="mb-2 sm:mb-4 text-gray-300 text-sm sm:text-base">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email/Username</FormLabel>
                  <Input {...field} className="bg-[#23242a] border border-[#23242a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30 text-white placeholder-gray-400 rounded-lg py-3" />
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
                  <Input type="password" {...field} className="bg-[#23242a] border border-[#23242a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30 text-white placeholder-gray-400 rounded-lg py-3" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg shadow py-3 transition-all duration-200' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
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
