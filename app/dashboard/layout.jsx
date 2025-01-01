"use client"; // Ensure this is a client component
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";

export default function DashboardLayout({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-up if the user is not signed in
    if (isLoaded && !isSignedIn) {
      router.push("/sign-up");
    }
  }, [isLoaded, isSignedIn, router]);

  return <div>
  <Header></Header>
  <div className="px-16 dark:bg-gray-900">
  {children}
  </div>
  </div>;
}
