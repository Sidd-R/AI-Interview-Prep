"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const csvData = [
  {
    question: "What is your greatest strength?",
    answer: "My greatest strength is my ability to adapt quickly to new situations and learn new skills efficiently.",
    fluency_score: 4,
    grammar_score: 5,
    relevancy_score: 4,
    suggested_answer: "When discussing your greatest strength, it's important to provide a specific example that demonstrates how you've applied this strength in a professional context."
  },
  {
    question: "What is your greatest strength?",
    answer: "My greatest strength is my ability to adapt quickly to new situations and learn new skills efficiently.",
    fluency_score: 4,
    grammar_score: 5,
    relevancy_score: 4,
    suggested_answer: "When discussing your greatest strength, it's important to provide a specific example that demonstrates how you've applied this strength in a professional context."
  },
  {
    question: "What is your greatest strength?",
    answer: "My greatest strength is my ability to adapt quickly to new situations and learn new skills efficiently.",
    fluency_score: 4,
    grammar_score: 5,
    relevancy_score: 4,
    suggested_answer: "When discussing your greatest strength, it's important to provide a specific example that demonstrates how you've applied this strength in a professional context."
  },
  {
    question: "What is your greatest strength?",
    answer: "My greatest strength is my ability to adapt quickly to new situations and learn new skills efficiently.",
    fluency_score: 4,
    grammar_score: 5,
    relevancy_score: 4,
    suggested_answer: "When discussing your greatest strength, it's important to provide a specific example that demonstrates how you've applied this strength in a professional context."
  },
  {
    question: "What is your greatest strength?",
    answer: "My greatest strength is my ability to adapt quickly to new situations and learn new skills efficiently.",
    fluency_score: 4,
    grammar_score: 5,
    relevancy_score: 4,
    suggested_answer: "When discussing your greatest strength, it's important to provide a specific example that demonstrates how you've applied this strength in a professional context."
  },
  {
    question: "What is your greatest strength?",
    answer: "My greatest strength is my ability to adapt quickly to new situations and learn new skills efficiently.",
    fluency_score: 4,
    grammar_score: 5,
    relevancy_score: 4,
    suggested_answer: "When discussing your greatest strength, it's important to provide a specific example that demonstrates how you've applied this strength in a professional context."
  },
  // Add more data as needed
];

const ScoreCard = ({ title, score }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-3xl font-bold text-blue-600">{score}/5</div>
  </div>
);

const AnswerCard = ({ question, answer, scores, suggestedAnswer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg mb-6"
    >
      <h2 className="text-xl font-bold mb-4">{question}</h2>
      <p className="mb-4">{answer}</p>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ScoreCard title="Fluency" score={scores.fluency} />
        <ScoreCard title="Grammar" score={scores.grammar} />
        <ScoreCard title="Relevancy" score={scores.relevancy} />
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        {isOpen ? 'Hide' : 'Show'} Suggested Answer
        {isOpen ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-blue-50 rounded-md"
        >
          <p>{suggestedAnswer}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

const OverallScoreChart = ({ data }) => {
  const chartData = data.map((item, index) => ({
    name: `Q${index + 1}`,
    Fluency: item.fluency_score,
    Grammar: item.grammar_score,
    Relevancy: item.relevancy_score,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Overall Score Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Fluency" fill="#3B82F6" />
          <Bar dataKey="Grammar" fill="#10B981" />
          <Bar dataKey="Relevancy" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const InterviewAssessment = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Interview Answer Assessment
        </h1>
        <OverallScoreChart data={csvData} />
        {csvData.map((item, index) => (
          <AnswerCard
            key={index}
            question={item.question}
            answer={item.answer}
            scores={{
              fluency: item.fluency_score,
              grammar: item.grammar_score,
              relevancy: item.relevancy_score,
            }}
            suggestedAnswer={item.suggested_answer}
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewAssessment;