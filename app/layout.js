
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Toaster } from "@/components/ui/sonner";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mock AI - Interview Coach",
  description: "Prepare for your dream job with our AI Personalized Interview Coach! Experience a realistic, simulated interview environment where AI acts as both your interviewer and evaluator. Practice answering tough questions, improve your communication skills, and receive detailed feedback based on your performance",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    > <ThemeWrapper>
      <div className="h-screen overflow-y-auto
  [&::-webkit-scrollbar]:w-3
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
       {children}
      </div>
       <Toaster />
    </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
