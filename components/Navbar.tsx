"use client";
import React from "react";
import { IconDashboard, IconHome, IconMessage } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { auth } from "@/utils/firebase";
import FloatingNav from "./ui/floating-navbar";
import { useRouter } from "next/navigation";
import { BadgeCheck, NotepadText } from "lucide-react";
export function Navbar() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success("Logout successful");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error Logout:", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: (
        <IconDashboard className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Leaderboard",
      link: "/leaderboard-dash",
      icon: <BadgeCheck className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    // {
    //   name: "Contact",
    //   link: "/contact",
    //   icon: (
    //     <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
    //   ),
    // },
    {
      name: "Feedback",
      link: "/feedback",
      icon: (
        <NotepadText className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} handleSignOut={handleSignOut} />
    </div>
  );
}
