"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";
import Loader from "./Loader";

let detectInterval;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: "user", // Default to front-facing camera
  });
  const [isRearCamera, setIsRearCamera] = useState(false); // State to track the current camera
  const [isWebcamActive, setIsWebcamActive] = useState(true); // Track webcam active state

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  async function runCoco() {
    setIsLoading(true); // Set loading state to true when model loading starts
    const net = await cocoSSDLoad();
    setIsLoading(false); // Set loading state to false when model loading completes

    detectInterval = setInterval(() => {
      runObjectDetection(net); // will build this next
    }, 10);
  }

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // find detected objects
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }

  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  // Toggle between front and rear camera
  const toggleCamera = () => {
    const newCamera = isRearCamera ? "user" : "environment";
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
        tracks.forEach(track => track.stop());
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
      runCoco();
      showmyVideo();
    }
  }, [isWebcamActive]);

  return (
    
    <div className="mt-8 relative flex flex-col items-center">
      {isLoading ? (
        <div className="justify-center items-center"><Loader/>
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
          {isRearCamera ? "Switch to Front Camera" : "Switch to Rear Camera"}
        </button>

        {/* Button to Start/Stop Webcam */}
        <button
          onClick={toggleWebcam}
          className="p-3 bg-zinc-700 text-white rounded-3xl shadow-md text-sm hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 w-full sm:w-auto"
        >
          {isWebcamActive ? "Stop Webcam" : "Start Webcam"}
        </button>
      </div>
    </div>
  );
};

export default ObjectDetection;
