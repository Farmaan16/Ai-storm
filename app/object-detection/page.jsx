'use client';

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { CameraIcon, SwitchCameraIcon } from "lucide-react";

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
    <div className="bg-primary grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-[100vh] p-8 pb-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400 text-center max-w-full">
        Object Detection
      </h1>

      {/* Loading State */}
      {isLoading ? (
        <div className="justify-center items-center">
          <Loader />
          <span className="gradient-text text-center text-gray-500">Loading AI Model...</span>
        </div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md w-full max-w-[100vw]">
          {/* Webcam */}
          {isWebcamActive && (
            <Webcam
              ref={webcamRef}
              className="rounded-md w-full lg:h-[720px] max-h-[100vh] object-cover"
              muted
              videoConstraints={videoConstraints} // Pass the dynamic videoConstraints
            />
          )}

          {/* Canvas */}
          {isWebcamActive && (
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 z-99999 w-full lg:h-[720px] max-h-[100vh] object-cover"
            />
          )}
        </div>
      )}

      {/* Buttons to toggle between front/rear camera and start/stop webcam */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button
          onClick={toggleCamera}
          className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
        >
          <SwitchCameraIcon className="w-4 h-4 mr-2" />
          {isRearCamera ? "Front Camera" : "Rear Camera"}
        </Button>
        <Button
          onClick={toggleWebcam}
          className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
        >
          <CameraIcon className="w-4 h-4 mr-2" />
          {isWebcamActive ? "Stop Camera" : "Start Camera"}
        </Button>
      </div>
    </div>
  );
};

export default ObjectDetection;
