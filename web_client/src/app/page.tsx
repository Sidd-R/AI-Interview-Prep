"use client"
import React from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import TechInterview from "@/components/TechInterview";
import HRInterview from "@/components/HRInterview";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero type="home" />
      <TechInterview />
      <HRInterview /> 
      {/* <Lottie animationData={InterviewAnimation}  loop className="w-96 h-96"/> */}
    </>
  );
}
