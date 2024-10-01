"use client";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const skillsData = [
  {
    Skill: "Frontend Development",
    "Resource 1": "https://roadmap.sh/frontend",
    "Resource 2": "https://www.w3schools.com/whatis/whatis_frontenddev.asp",
    Roadmap: "https://roadmap.sh/frontend",
  },
  {
    Skill: "Backend Development",
    "Resource 1": "https://www.geeksforgeeks.org/backend-development/",
    "Resource 2": "https://roadmap.sh/backend",
    Roadmap: "https://roadmap.sh/backend",
  },
  {
    Skill: "Blockchain",
    "Resource 1": "https://www.blockchain.com/",
    "Resource 2": "https://en.wikipedia.org/wiki/Blockchain",
    Roadmap: "https://roadmap.sh/blockchain",
  },
  {
    Skill: "Machine Learning",
    "Resource 1": "https://en.wikipedia.org/wiki/Machine_learning",
    "Resource 2": "https://www.ibm.com/topics/machine-learning",
    Roadmap: "https://roadmap.sh/machine-learning",
  },
  {
    Skill: "Data Science",
    "Resource 1": "https://en.wikipedia.org/wiki/Data_science",
    "Resource 2": "https://www.datacamp.com/blog/what-is-data-science",
    Roadmap: "https://roadmap.sh/data-science",
  },
  {
    Skill: "UI/UX Design",
    "Resource 1":
      "https://www.interaction-design.org/literature/topics/ui-design",
    "Resource 2":
      "https://www.smashingmagazine.com/2018/01/guide-user-experience-design/",
    Roadmap: "https://roadmap.sh/ui-ux",
  },
  {
    Skill: "Data Structures and Algorithms",
    "Resource 1": "https://www.geeksforgeeks.org/data-structures/",
    "Resource 2":
      "https://www.coursera.org/specializations/data-structures-algorithms",
    Roadmap: "https://roadmap.sh/data-structures",
  },
  {
    Skill: "Competitive Programming",
    "Resource 1": "https://codeforces.com/",
    "Resource 2":
      "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript",
    Roadmap: "https://roadmap.sh/competitive-programming",
  },
  {
    Skill: "Cybersecurity",
    "Resource 1": "https://www.cybrary.it/",
    "Resource 2": "https://www.coursera.org/specializations/it-security",
    Roadmap: "https://roadmap.sh/cyber-security",
  },
  {
    Skill: "Cloud Computing",
    "Resource 1": "https://aws.amazon.com/what-is-cloud-computing/",
    "Resource 2":
      "https://azure.microsoft.com/en-us/overview/what-is-cloud-computing/",
    Roadmap: "https://roadmap.sh/cloud",
  },
];

const SkillCard = ({ skill, isRecommended }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`mb-4 rounded-lg shadow-md ${
        isRecommended ? "bg-indigo-50" : "bg-white"
      }`}
    >
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3
          className={`text-lg font-medium ${
            isRecommended ? "text-indigo-700" : "text-gray-700"
          }`}
        >
          {skill.Skill}
        </h3>
        {isExpanded ? (
          <ChevronUpIcon size={20} />
        ) : (
          <ChevronDownIcon size={20} />
        )}
      </div>
      {isExpanded && (
        <div className="p-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={skill["Resource 1"]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300"
            >
              Resource 1
            </a>
            <a
              href={skill["Resource 2"]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300"
            >
              Resource 2
            </a>
            <a
              href={skill.Roadmap}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors duration-300"
            >
              Roadmap
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const SkillsResourceMapper = () => {
  const [userSkills, setUserSkills] = useState(["Frontend Development", "Backend Development", "Machine Learning"]);

  const recommendedResources = skillsData.filter((resource) =>
    userSkills.some(
      (skill) => skill.toLowerCase() === resource.Skill.toLowerCase()
    )
  );

  const otherResources = skillsData.filter(
    (resource) =>
      !userSkills.some(
        (skill) => skill.toLowerCase() === resource.Skill.toLowerCase()
      )
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Your Learning Resources Hub
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-600">
            <h2 className="text-xl leading-6 font-medium text-white">
              Recommended Resources
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-indigo-200">
              Based on your skills: {userSkills.join(", ")}
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {recommendedResources.map((resource, index) => (
              <SkillCard key={index} skill={resource} isRecommended={true} />
            ))}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-600">
            <h2 className="text-xl leading-6 font-medium text-white">
              All Resources
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-300">
              Explore other learning paths
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {otherResources.map((resource, index) => (
              <SkillCard key={index} skill={resource} isRecommended={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsResourceMapper;
