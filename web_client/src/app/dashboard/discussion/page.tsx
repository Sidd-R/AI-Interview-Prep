"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

const DiscussionCard = ({ avatar, name, text, isInFavor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <div className={`w-full rounded-lg shadow-md overflow-hidden ${isInFavor ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-center">{name}</h3>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  </motion.div>
);

const DiscussionSimulation = () => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col justify-between p-8">
      <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl mx-auto flex-grow">
        <div className="w-full md:w-1/2 md:pr-4">
          <DiscussionCard
            avatar="/api/placeholder/100/100"
            name="Pro AI"
            text="AI technology has the potential to revolutionize various industries and improve our daily lives. It can enhance efficiency, provide valuable insights, and solve complex problems that were previously impossible to tackle. With proper regulation and ethical guidelines, AI can be a powerful tool for progress and innovation."
            isInFavor={true}
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-4">
          <DiscussionCard
            avatar="/api/placeholder/100/100"
            name="Con AI"
            text="The rapid advancement of AI raises ethical concerns and potential job displacement issues. There are valid concerns about privacy, security, and the potential for AI to be misused. We must carefully consider the societal impact of AI and ensure that its development aligns with human values and doesn't exacerbate existing inequalities."
            isInFavor={false}
          />
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            className={`rounded-full p-8 shadow-lg focus:outline-none transition-colors duration-300 ${
              isRecording ? 'bg-red-500 text-white' : 'bg-white text-gray-800'
            }`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className={`h-8 w-8 ${isRecording ? 'animate-pulse' : ''}`} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DiscussionSimulation;