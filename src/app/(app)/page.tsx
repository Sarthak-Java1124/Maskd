'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Grid Background */}
      <div className="min-h-screen w-full bg-black relative flex items-center justify-center overflow-hidden overscroll-x-none max-w-full">
        {/* Animated Grid SVG Background */}
        <div className="absolute inset-0 z-0 pointer-events-none animate-grid-move">
          <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-white" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.32" />
              </pattern>
              <pattern id="grid-dark" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1.4" opacity="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dark)" />
            <rect width="100%" height="100%" fill="url(#grid-white)" />
          </svg>
        </div>
        {/* Focused Card Container */}
        <motion.div
          className="relative z-10 w-full max-w-3xl mx-auto rounded-3xl shadow-2xl bg-white/10 backdrop-blur-2xl border border-[#00ffe7]/20 p-2 sm:p-4 md:p-8 flex flex-col gap-0 sm:gap-2 md:gap-4 min-h-[80vh]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Gaming-Inspired Header */}
          <header className="w-full bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#232526] border-b border-[#00ffe7]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between px-3 py-3 sm:px-6 sm:py-4 md:px-12 md:py-6 rounded-t-3xl gap-2 sm:gap-0">
            <div className="text-2xl sm:text-2xl md:text-3xl font-extrabold tracking-widest text-[#00ffe7] drop-shadow-[0_2px_12px_rgba(0,255,231,0.7)] font-mono uppercase select-none">
              <span className="animate-pulse">Maskd</span>
            </div>
            <Link href="/sign-in">
              <motion.button
                className="rounded-full px-4 sm:px-7 py-2 bg-[#232526] text-[#00ffe7] font-bold shadow-lg border border-[#00ffe7]/40 hover:bg-[#00ffe7] hover:text-[#232526] hover:shadow-[0_0_32px_8px_#00ffe7] transition-all duration-200 text-base sm:text-lg tracking-wide uppercase relative overflow-hidden group focus:outline-none"
                whileHover={{ scale: 1.05, boxShadow: '0 0 24px 0 #4ade8033' }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              >
                Login
              </motion.button>
            </Link>
          </header>

          {/* Main content */}
          <main className="flex flex-col items-center justify-center px-2 sm:px-4 md:px-12 pt-6 sm:pt-8 pb-6 sm:pb-8 text-gray-900 w-full">
            <motion.section
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
              <motion.h1
                className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-transparent bg-clip-text drop-shadow-lg font-mono relative overflow-visible"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              >
                <span className="absolute left-0 top-0 w-full h-full pointer-events-none bg-gradient-to-r from-green-400 via-green-200 to-green-500 bg-clip-text text-transparent animate-shimmer z-10" aria-hidden="true">Maskd</span>
                Maskd
              </motion.h1>
              <motion.p
                className="mt-2 sm:mt-4 text-base sm:text-lg md:text-2xl text-gray-600 font-medium max-w-xs sm:max-w-xl mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
              >
                Anonymous, masked feedback
              </motion.p>
            </motion.section>

            {/* Carousel for Messages */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            >
              <Carousel
                plugins={[Autoplay({ delay: 2000 })]}
                className="w-full max-w-xs sm:max-w-lg md:max-w-2xl"
              >
                <CarouselContent>
                  {messages.map((message, index) => (
                    <CarouselItem key={index} className="p-4">
                      <div className="animate-fade-in-up">
                        <motion.div
                          className="rounded-3xl shadow-2xl bg-gradient-to-br from-green-900 via-black to-green-800 border-4 border-green-700/40 transition-all duration-300 relative overflow-hidden"
                          initial={{ opacity: 0, y: 40, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.7, delay: 0.6 + index * 0.1, ease: 'easeOut' }}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-green-400">
                              <Mail className="w-6 h-6 text-green-400" />
                              {message.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                            <div className="flex-shrink-0 hidden md:block">
                              <Mail className="w-10 h-10 text-green-700/70" />
                            </div>
                            <div>
                              <p className="text-green-200 text-lg font-medium mb-2">{message.content}</p>
                              <p className="text-xs text-green-700">{message.received}</p>
                            </div>
                          </CardContent>
                        </motion.div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="text-center p-2 sm:p-4 md:p-6 bg-transparent text-gray-400 font-medium rounded-b-3xl text-xs sm:text-sm md:text-base">
            © 2025 Sarthak Harsh. All rights reserved.
          </footer>
        </motion.div>
      </div>

      {/* Floating Animated Particles */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <AnimatePresence>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-green-400 via-green-700 to-blue-500 opacity-20"
              style={{
                width: `${36 + (i % 2) * 16}px`,
                height: `${36 + (i % 3) * 12}px`,
                left: `${10 + (i * 15)}%`,
                top: `${10 + (i * 12)}%`,
                filter: 'blur(6px)'
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 18 + i * 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
                delay: i * 0.5
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes grid-move {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-40px) translateX(-40px); }
        }
        .animate-grid-move {
          animation: grid-move 18s linear infinite;
        }
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 32px 8px #22d3ee44, 0 0 0 0 #4ade8044; }
          50% { box-shadow: 0 0 64px 16px #4ade80cc, 0 0 32px 8px #22d3ee88; }
        }
        .animate-card-glow {
          animation: card-glow 2.8s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
        html, body, #__next {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }
        .absolute, .fixed, .inset-0 {
          max-width: 100vw !important;
          left: 0 !important;
          right: 0 !important;
        }
      `}</style>
    </>
  );
}
