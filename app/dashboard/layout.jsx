"use client"; 
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";

export default function DashboardLayout({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-up");
    }
  }, [isLoaded, isSignedIn, router]);

  return <div>
  <Header></Header>
  <div className="lg:px-16 max-sm:px-5 dark:bg-gray-900">
  {children}
  </div>
  </div>;
}
