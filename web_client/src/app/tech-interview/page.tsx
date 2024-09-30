'use client';
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function page() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [image, setImage] = useState("")

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
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        

        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const context = canvas.getContext('2d');

        setInterval(() => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = canvas.toDataURL('image/jpeg');
          setImage(frame)
          
          socket.emit('image-tech', {
            image: frame,
          });
        }, 200);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    captureVideo();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Tech Interview
            </h1>
          </div>
        </header>
        <main>
          {/* <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> */}
            {/* Your content */}
            <img src={image} alt="Webcam" />

          {/* </div> */}
        </main>
      </div>
    </>
  );
}
