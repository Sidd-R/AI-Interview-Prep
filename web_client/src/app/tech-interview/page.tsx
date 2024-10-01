"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useAppSelector } from "@/hooks";
import { useDispatch } from "react-redux";
import {
  addScore,
  endInterview,
  nextQuestion,
  setResumeText,
  startInterview,
} from "@/features/techInterview";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function page() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [image, setImage] = useState("");
  const [open, setOpen] = useState(true);
  const [resumeFile, setResumeFile] = useState<File>();

  const { questions, code, resumeText, scores, hasStarted } = useAppSelector(
    (state) => state.techInterview
  );
  const dispatch = useDispatch();

  const chartData = scores.flatMap((score, index) => [
    {
      name: `Grammar ${index + 1}`,
      value: score.grammar_score,
      fill: "#8884d8",
    },
    {
      name: `Relevancy ${index + 1}`,
      value: score.relevancy_score,
      fill: "#82ca9d",
    },
    {
      name: `Fluency ${index + 1}`,
      value: score.fluency_score,
      fill: "#ffc658",
    },
  ]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("disconnected from socket server");
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
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const context = canvas.getContext("2d");

          setInterval(() => {
            context?.drawImage(
              videoRef.current as HTMLVideoElement,
              0,
              0,
              canvas.width,
              canvas.height
            );
            const frame = canvas.toDataURL("image/jpeg");
            // setImage(frame);

            // socket.emit('image-tech', {
            //   image:'ss'// frame,
            // });
          }, 2000);
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    captureVideo();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleResumeUpload = () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append("resume", resumeFile);

    fetch("http://localhost:5000/start-tech-interview", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(setResumeText(data.resume));
        dispatch(startInterview());
        dispatch(nextQuestion(data.question));
        textToSpeech(data.question);
      })
      .catch((error) => {
        console.error("Error uploading resume:", error);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  // text to speech
  function textToSpeech(text: string, rate: number = 0.8) {
    window.speechSynthesis.cancel();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      console.log("utterance", utterance);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  // useEffect(() => {
  // textToSpeech('Welcome to the tech interview!');
  // }, []);

  // audio record
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isRecording) {
        console.log("Start recording");
        startRecording();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space" && isRecording) {
        console.log("Stop recording");
        stopRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
    mediaRecorderRef.current?.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];
      sendAudioToBackend(audioBlob);
    });
  };

  const navigate = useRouter();

  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("answer_audio", audioBlob, "recording.wav");
    formData.append("previous_question", questions[questions.length - 1]);
    formData.append("question_count", questions.length.toString());

    console.log("question_count", questions.length.toString());

    try {
      const response = await fetch("http://localhost:5000/next-tech-question", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (questions.length === 2) {
        dispatch(addScore(data.scores));
        toast.success("Interview completed!");
        console.log("questions", questions);
        console.log("scores", scores);
        dispatch(endInterview());

        // navigate.push("/dashboard");
        return;
      }

      dispatch(nextQuestion(data.question));
      textToSpeech(data.question);
      dispatch(addScore(data.scores));

      console.log(data);
      
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <>
      {/* resume input */}
      <Dialog
        open={open}
        onClose={() => {
          if (resumeFile) {
            setOpen(false);
          }
        }}
        className="relative z-10"
      >
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
                        onChange={(e) => {
                          if (e.target.files?.[0])
                            setResumeFile(e.target.files?.[0]);
                        }}
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

      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-indigo-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Tech Interview
            </h1>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col">
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-auto" />
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col">
              {questions && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4 flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Current Question
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    {questions[questions.length - 1]}
                  </p>
                  {code && (
                    <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-200">{code}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {scores.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Interview Scores
              </h2>
              <div className="space-y-8">
                {scores.map((score, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Question {index + 1}
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(score).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace("_score", "")}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {value/5*100}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getScoreColor(
                                value/5*100
                              )}`}
                              style={{ width: `${value/5*100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
