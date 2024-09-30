import React from "react";
import Image from "next/image";
import InterviewAnimation from '@/lottie/Animation - 1727709811461.json';
import TechGlobe from '@/lottie/SpinningGlobe.json';
import Lottie from "lottie-react";

type HeroProps = {
  type?: string;
  title?: string;
};

const Hero = ({ type, title }: HeroProps) => {
  return (
    <section
      className={
        "px-5 flex flex-col-reverse pt-5 mt-16 sm:mt-0 sm:flex-row items-center sm:pl-[75px] sm:pr-[150px] sm:pb-24 sm:pt-14 Hero sm:justify-between sm:items-start" +
        `${type === "home" ? "" : " sm:min-h-screen"}`
      }
    >
      <div className="flex flex-col gap-5 sm:gap-12">
        <div>
          {title ? (
            <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
          ) : (
            <h1 className="font-bold">
              Elevate your<br></br><span className="text-primary-500">Placement</span> Preparation
            </h1>
          )}
          <p>Prepare and Feel Confident for Interviews</p>
        </div>
        <div className="card flex px-5 py-6 sm:p-10 items-center sm:mr-10 font-bold text-center">
          <div>
            <p>Personalised Roadmaps</p>
          </div>
          <div className="vr"></div>
          <div>
            <p>AI-Based Mock Interviews</p>
          </div>
          <div className="vr"></div>
          <div>
            <p>Simulated Group Discussions</p>
          </div>
        </div>
      </div>
      {/* <img
        src="/images/Hero.png"
        alt="Hero"
        className="w-[240px] mb-2 sm:mb-0 sm:w-[550px] rounded-2xl"
        height={1000}
        width={1000}
      /> */}
            <Lottie animationData={InterviewAnimation}  loop className="w-[240px] mb-2 sm:mb-0 sm:w-[550px] rounded-2xl"/>

    </section>
  );
};

export default Hero;
