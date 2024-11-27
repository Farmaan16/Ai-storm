'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs'; // Import TensorFlow.js
import Webcam from 'react-webcam';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { CameraIcon, SwitchCameraIcon } from 'lucide-react';

let detectInterval;

const FaceLandmarkDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: 'user', // Default to front-facing camera
  });
  const [isRearCamera, setIsRearCamera] = useState(false); // Track the current camera
  const [isWebcamActive, setIsWebcamActive] = useState(true); // Webcam active state

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null); // Store the face landmark detection model

  // Load the face landmark detection model and set up detection
  const loadModel = async () => {
    setIsLoading(true); // Set loading state to true when model loading starts
    try {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
      setDetector(model); // Set the model after loading
      setIsLoading(false); // Set loading state to false when model is loaded
    } catch (error) {
      console.error("Error loading model", error);
      setIsLoading(false); // Stop loading in case of error
    }
  };

  useEffect(() => {
    loadModel(); // Initial model loading
  }, []);

  const detectFaceLandmarks = async () => {
    if (detector && webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size based on video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Make predictions directly from the video element
      const faces = await detector.estimateFaces(video, { flipHorizontal: false });

      // Clear previous drawings
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw landmarks if faces are detected
      if (faces.length > 0) {
        faces.forEach((face) => {
          face.keypoints.forEach((keypoint) => {
            context.beginPath();
            context.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
            context.fillStyle = 'red';
            context.fill();
          });
        });
      }
    }
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
      // When turning the webcam back on, reload the model
      loadModel(); // Reload the model when the webcam is turned back on
      setIsLoading(true); // Show loading message while initializing the webcam
      webcamRef.current?.video?.play();
    }

    // Toggle the webcam active state
    setIsWebcamActive(!isWebcamActive);
  };

  useEffect(() => {
    if (isWebcamActive) {
      showmyVideo();
      detectInterval = setInterval(detectFaceLandmarks, 50); // Detect face landmarks every 50ms
    } else {
      clearInterval(detectInterval); // Stop detection when webcam is off
    }
  }, [isWebcamActive, detector]);

  return (
    <div className="grid bg-primary grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-[100vh] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400 text-center max-w-full">
        Face Landmark Detection
      </h1>

      {/* Loading State */}
      {isLoading ? (
        <div className="justify-center items-center">
          <Loader />
          <span className="gradient-text text-center text-gray-500">Loading AI Model...</span>
        </div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md w-full max-w-[100vw] overflow-hidden">
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
      <div className="flex flex-col sm:flex-row gap-4">
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

export default FaceLandmarkDetection;
