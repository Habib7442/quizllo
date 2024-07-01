"use client";
import { Navbar } from "@/components/Navbar";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardLayout = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        router.push("/");
        setUser(null);
      }
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);
  return (
    <div className="relative w-full h-full mt-16">
      <HeroHighlight>
        <Navbar />
        {children}
      </HeroHighlight>
    </div>
  );
};

export default DashboardLayout;
