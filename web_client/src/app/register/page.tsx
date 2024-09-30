"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const skills = [
    "Frontend Development",
    "Backend Development",
    "Blockchain",
    "Machine Learning",
    "Data Science",
    "UI/UX Design",
    "Data Structures and Algorithms",
    "Competitive Programming",
    "Cybersecurity",
    "Cloud Computing",
  ];

  const goals = [
    "Prepare for placements",
    "Learn new skills",
    "Improve existing skills",
  ]

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [index, setIndex] = useState(0);
  const [countSelected, setCountSelected] = useState(0);
  const [goal, setGoal] = useState(0);
  const [selectedSkillsRating, setSelectedSkillsRating] = useState(
    new Array(skills.length).fill(0)
  );
  const [selectedSkills, setSelectedSkills] = useState(
    new Array(skills.length).fill(false)
  );

  const handleSkillSelection = (skillIndex: number) => {
    if (selectedSkills[skillIndex]) {
      setCountSelected(countSelected - 1); // Deselect skill
    } else if (countSelected < 3) {
      setCountSelected(countSelected + 1); // Select skill
    } else {
      toast.error("You can select at most 3 skills");
      return;
    }

    setSelectedSkills(
      selectedSkills.map((selectedSkill, i) =>
        i === skillIndex ? !selectedSkill : selectedSkill
      )
    );
  };

  const handleNext = () => {
    if (index === 0 && (!email || !password || !name)) {
      toast.error("Please fill all the fields");
      return;
    }
    if (index === 1 && countSelected === 0) {
      toast.error("Please select at least one skill");
      return;
    }
    if (index === 1 && countSelected > 3) {
      toast.error("You can select at most 3 skills");
      return;
    }
    setIndex(index + 1);
  };

  const handlePrev = () => {
    setIndex(index - 1);
  };

  const handleSubmit = () => {
    const requestBody = {
        name: name,
        email: email,
        password: password,
        skills: skills.filter((_, i) => selectedSkills[i]),
        skillsRating: selectedSkillsRating.filter((_, i) => selectedSkills[i]),
        goal: goals[goal],
    }

    console.log(requestBody);
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-8 lg:px-8">
        {/* Progress Bar */}
        <div className="w-[80%] mx-auto h-4 mb-10 bg-gray-200 rounded-full absolute top-20 left-[50%] translate-x-[-50%]">
          <div
            className="h-4 bg-primary-500 rounded-full"
            style={{ width: `${(index / 3) * 100}%` }}
          ></div>
        </div>

        {/* Previous and Next buttons */}
        {index > 0 && (
          <button
            className="w-5 top-[50%] translate-y-[-50%] left-20 absolute"
            onClick={handlePrev}
          >
            <ChevronLeftIcon />
          </button>
        )}
        {index < 3 && (
          <button
            className="w-5 top-[50%] translate-y-[-50%] right-20 absolute"
            onClick={handleNext}
          >
            <ChevronRightIcon />
          </button>
        )}
        {index === 3 && (
            <button
              className="top-[50%] translate-y-[-50%] right-20 absolute x-3 py-2 text-sm sm:px-6 sm:py-4 text-white bg-primary-500"
              onClick={handleSubmit}
            >
                Submit
            </button>
        )}
        {/* Step 1: User Information */}
        {index === 0 && (
          <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Create Your Account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Skills Selection */}
        {index === 1 && (
          <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Please Select Your Skills
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg flex flex-wrap gap-5">
              {skills.map((skill, skillIndex) => (
                <button
                  key={skill}
                  className={`px-5 py-2 border-2 rounded-full ${
                    selectedSkills[skillIndex]
                      ? "border-primary-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleSkillSelection(skillIndex)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3: Rate Your Skills */}
        {index === 2 && (
          <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Rate Your Skills
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg flex flex-col gap-5">
              {skills.map(
                (skill, skillIndex) =>
                  selectedSkills[skillIndex] && (
                    <div
                      key={skill}
                      className="flex items-center justify-between"
                    >
                      <p>{skill}</p>
                      <input
                        type="range"
                        value={selectedSkillsRating[skillIndex]}
                        min="0"
                        max="10"
                        onChange={(e) => {
                          setSelectedSkillsRating(
                            selectedSkillsRating.map((rating, i) =>
                              i === skillIndex ? e.target.value : rating
                            )
                          );
                        }}
                      />
                    </div>
                  )
              )}
            </div>
          </>
        )}

        {/* Step 4: What is your main goal */}
        {index === 3 && (
          <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                What is your main goal?
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg flex flex-col gap-5">
              {goals.map((currgoal, index) => (
                <button
                  key={currgoal}
                  className={`px-5 py-2 border-2 rounded-full ${
                    index === goal
                      ? "border-primary-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setGoal(index)}
                >
                  {currgoal}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
