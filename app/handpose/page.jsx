'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs'; // Import TensorFlow.js
import Webcam from 'react-webcam';
import Loader from '@/components/Loader';


let detectInterval;

const HandPoseDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: 'user', // Default to front-facing camera
  });
  const [isRearCamera, setIsRearCamera] = useState(false); // Track the current camera
  const [isWebcamActive, setIsWebcamActive] = useState(true); // Webcam active state

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null); // Store the handpose model

  // Manually define the hand connections (this can vary by version of the model)
  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],  // Index
    [0, 9], [9, 10], [10, 11], [11, 12],  // Middle finger
    [0, 13], [13, 14], [14, 15], [15, 16],  // Ring finger
    [0, 17], [17, 18], [18, 19], [19, 20],  // Pinky
    [1, 5], [2, 6], [3, 7], [4, 8],  // Thumb to index, middle, etc.
    [5, 9], [6, 10], [7, 11], [8, 12],  // Index to middle, etc.
    [9, 13], [10, 14], [11, 15], [12, 16],  // Middle to ring finger
    [13, 17], [14, 18], [15, 19], [16, 20],  // Ring to pinky
  ];

  // Load the handpose model and set up detection
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true); // Set loading state to true when model loading starts
      const handposeModel = await handpose.load();
      setModel(handposeModel); // Set the model after loading
      setIsLoading(false); // Set loading state to false when model is loaded
    };

    loadModel();
  }, []);

  const detectHands = async () => {
    if (model && webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size based on video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Make predictions
      const predictions = await model.estimateHands(video);

      // Clear previous drawings
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw landmarks and connections if hands are detected
      if (predictions.length > 0) {
        renderPredictions(predictions, context, HAND_CONNECTIONS);
      }
    }
  };

  const renderPredictions = (predictions, context, handConnections) => {
    predictions.forEach((prediction) => {
      // Draw landmarks
      prediction.landmarks.forEach(([x, y]) => {
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
      });

      // Draw skeleton using the predefined HAND_CONNECTIONS array
      handConnections.forEach(([i, j]) => {
        context.beginPath();
        context.moveTo(prediction.landmarks[i][0], prediction.landmarks[i][1]);
        context.lineTo(prediction.landmarks[j][0], prediction.landmarks[j][1]);
        context.strokeStyle = 'blue';
        context.lineWidth = 2;
        context.stroke();
      });
    });
  };

  const showmyVideo = () => {
    if (webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  // Toggle between front and rear camera
  const toggleCamera = () => {
    const newCamera = isRearCamera ? 'user' : 'environment';
    setIsRearCamera(!isRearCamera); // Toggle the camera state
    setVideoConstraints({
      facingMode: newCamera, // Switch between 'user' (front) and 'environment' (rear)
    });
  };

  // Start/Stop Webcam
  const toggleWebcam = () => {
    if (isWebcamActive) {
      // Stop the webcam stream by clearing the video element
      if (webcamRef.current?.video?.srcObject) {
        const stream = webcamRef.current.video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    } else {
      // Start the webcam stream by re-enabling the webcam
      setIsLoading(true); // Show loading message while initializing the webcam
      webcamRef.current?.video?.play();
    }

    // Toggle the webcam active state
    setIsWebcamActive(!isWebcamActive);
  };

  useEffect(() => {
    if (isWebcamActive) {
      showmyVideo();
      setInterval(detectHands, 100); // Detect hands every 100ms
    }
  }, [isWebcamActive, model]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[100vh] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <h1 className="font-extrabold text-3xl md:text-6xl lg:text-8xl ">Hand Pose detection</h1>
      {isLoading ? (
        <div className="justify-center items-center">
          <Loader/>
          <span className="gradient-text text-center text-gray-500">Loading AI Model...</span>
        </div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          {/* webcam */}
          {isWebcamActive && (
            <Webcam
              ref={webcamRef}
              className="rounded-md w-full lg:h-[720px]"
              muted
              videoConstraints={videoConstraints} // Pass the dynamic videoConstraints
            />
          )}

          {/* canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      )}

      {/* Buttons to toggle between front/rear camera and start/stop webcam */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Button to toggle between front and rear camera */}
        <button
          onClick={toggleCamera}
          className="p-3 bg-zinc-700 text-white rounded-3xl shadow-md text-sm hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 w-full sm:w-auto"
        >
          {isRearCamera ? 'Switch to Front Camera' : 'Switch to Rear Camera'}
        </button>

        {/* Button to Start/Stop Webcam */}
        <button
          onClick={toggleWebcam}
          className="p-3 bg-zinc-700 text-white rounded-3xl shadow-md text-sm hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 w-full sm:w-auto"
        >
          {isWebcamActive ? 'Stop Webcam' : 'Start Webcam'}
        </button>
      </div>
    </div>
  );
};

export default HandPoseDetection;
