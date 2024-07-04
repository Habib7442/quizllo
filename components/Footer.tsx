import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <Image width={100} height={100} className="w-10 h-10 rounded-full" src="/quizllo-logo.jfif" alt="logo"/>
          <span className="ml-3 text-xl text-blue-200">Quizllo</span>
        </a>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2024 Quizllo —
          <a
            href="https://twitter.com/knyttneve"
            className="text-gray-600 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            @quizllo
          </a>
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
