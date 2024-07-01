import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizllo",
  description:
    "Quizllo is an advanced AI-powered quiz application designed to provide a fun and engaging way to test your knowledge across various topics. Create custom quizzes, challenge friends, and enhance your learning experience with intelligent question generation. Perfect for students, educators, and trivia enthusiasts. Join Quizllo today and take your quizzing to the next level!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
