import TechGlobe from '@/lottie/SpinningGlobe.json';
import Lottie from 'lottie-react';
import Link from 'next/link';

export default function TechInterview() {

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pb-80  sm:pb-40 lg:pb-48 ">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Assess your technical skills!
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Give mock interviews in our AI powered platform and get detailed feedback on your performance. This includes your body language, tone, and technical skills. The questions would include verbal, coding, and technical questions. 
            </p>
          </div>
          <div>
            <div className="mt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8 -mt-24">
                   <Lottie animationData={TechGlobe}  loop className="w-96 h-96"/>
                </div>
              </div>

              <Link
                href={`/tech-interview`}
                className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
              >
                Start Tech Interview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
