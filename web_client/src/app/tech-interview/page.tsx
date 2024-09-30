'use client';
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useAppSelector } from '@/hooks';
import { useDispatch } from 'react-redux';
import { nextQuestion, setResumeText, startInterview } from '@/features/techInterview';

export default function page() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [image, setImage] = useState('');
  const [open, setOpen] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  
  const { questions, code, resumeText} = useAppSelector((state) => state.techInterview);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('disconnected from socket server');
    });

    // Capture video frames and send to server every 2 seconds
    const captureVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          // Set canvas dimensions to match video stream dimensions
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const context = canvas.getContext('2d');

          setInterval(() => {
            context.drawImage(
              videoRef.current,
              0,
              0,
              canvas.width,
              canvas.height
            );
            const frame = canvas.toDataURL('image/jpeg');
            setImage(frame);

            socket.emit('image-tech', {
              image: frame,
            });
          }, 2000);
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    // captureVideo();

    return () => {
      socket.disconnect();
    };
  }, []);

  

  const handleResumeUpload = () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append('resume', resumeFile);

    fetch('http://localhost:5000/start-interview', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(setResumeText(data.resume));
        dispatch(startInterview());
        dispatch(nextQuestion(data.question));
      })
      .catch((error) => {
        console.error('Error uploading resume:', error);
      })
      .finally(() => {
        setOpen(false);
      });
  }

  // text to speech
  const textToSpeech = (text: string) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);
  };

  textToSpeech('Welcome to the tech interview!');

  return (
    <>
      {/* resume input */}
      <Dialog open={open} onClose={() => {
        if (resumeFile) {
          setOpen(false);
        }
      }} className="relative z-10" >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Upload your resume
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        The questions in the interview will be based on the
                        information in your resume.
                      </p>

                      <input
                        className="mt-4 text-sm text-stone-500
                            file:mr-5 file:py-1 file:px-3 file:border-[1px]
                            file:text-xs file:font-medium
                            file:bg-stone-50 file:text-stone-700
                            hover:file:cursor-pointer hover:file:bg-blue-50
                            hover:file:text-blue-700"
                        type="file"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleResumeUpload}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Upload
                </button>

              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Tech Interview
            </h1>
          </div>
        </header>
        <main>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            <img
              src={image}
              alt="Webcam"
              style={{ width: '100%', maxWidth: '600px' }}
            />
            <video
              ref={videoRef}
              style={{ width: '100%', maxWidth: '600px' }}
            />
          </div>
        </main>
      </div>
    </>
  );
}
