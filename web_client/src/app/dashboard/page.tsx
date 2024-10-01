"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link"
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { ChevronRight } from 'lucide-react';

import AnalysisAnimation from '@/lottie/Animation - 1727725837341.json';
import TechInterview from '@/lottie/SpinningGlobe.json';
import HRInterview from '@/lottie/HR_Animation.json';
import GroupDiscussion from '@/lottie/Animation - 1727726507606.json';

const InterviewCard = ({ title, animation, href }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex flex-col items-center gap-4">
        <Lottie animationData={animation} loop className="w-40 h-40" />
        <Link
          type="button"
          href={href} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
        >
          Start {title}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  </div>
);

export default function Page() {
  const [userData, setUserData] = useState({
    name: 'Satyam Jaiswal',
    email: 'satyam21@gmail.com',
    skills: ['Frontend Development', 'Backend Development', 'Machine Learning'],
  });

  useEffect(() => {
    const login = localStorage.getItem("login")

    console.log(login)

    setUserData(JSON.parse(login as string))
  }, []);

  const handleInterviewStart = (type) => {
    console.log(`Starting ${type} interview`);
    // Add logic to start the interview
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12"
        >
          <div className="p-8 sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center text-3xl font-bold text-gray-600">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{userData.name}</h1>
                <p className="text-xl text-gray-600 mb-2">{userData.email}</p>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {userData.skills.length === 0 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300">
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <InterviewCard
              title="Explore Resources"
              animation={AnalysisAnimation}
              href="/dashboard/resources"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <InterviewCard
              title="Tech Interview"
              animation={TechInterview}
              href="/tech-interview"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InterviewCard
              title="HR Interview"
              animation={HRInterview}
              href="/hr-interview"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <InterviewCard
              title="Group Discussion"
              animation={GroupDiscussion}
              href="/dashboard/discussion"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}