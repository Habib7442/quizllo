"use client";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { BiLogInCircle } from "react-icons/bi";
import { auth, signUpWithGoogle } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import MagicButton from "./ui/MagicButton";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import toast from "react-hot-toast";

const Hero = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);
  const handleRegisterClick = async () => {
    try {
      const user = await signUpWithGoogle();
      if (user) {
        // Handle successful sign-in (e.g., redirect to dashboard)
        router.push("/dashboard");
        console.log("User signed in:", user.displayName, user.email);
      } else {
        // Handle sign-in failure (e.g., show an error message)
        console.error("Sign-in failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error signing in with Google:", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  return (
    <div className="relative">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
      </div>
      <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.1] bg-grid-black/[0.1] bg-[length:20px_20px] absolute left-0 top-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="flex w-full h-screen justify-center items-center relative z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Test Your Knowledge with Our AI-Generated Questions
          </h2>
          <TextGenerateEffect
            className="text-center text-[35px] md:text-5xl lg:text-5xl"
            words="Welcome to Quizllo: Elevate Your Quiz Game with AI"
          />

          <MagicButton
            title={user ? "Go to Dashboard" : "Sign In"}
            icon={<BiLogInCircle />}
            position="right"
            handleClick={
              user ? () => router.push("/dashboard") : handleRegisterClick
            }
            otherClasses=""
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
