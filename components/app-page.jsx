"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  BrainCircuit,
  Hand,
  Smile,
  ScanFaceIcon
} from "lucide-react";
import { BackgroundLines } from "./background-lines";
import { ImageIcon, Target, UserPlus, Edit, Mic } from "lucide-react";

const aiModels = [
  {
    title: "Object Detection",
    description: "Detect and locate objects in images or video streams",
    demoLink: "/object-detection",
    icon: <Target className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "Hand Pose Detection", 
    description:
      "Detect and track hand landmarks in real-time using TensorFlow.js",
    demoLink: "/handpose", 
    icon: <Hand className="h-12 w-12 text-purple-500" />, 
  },
  {
    title: "Sentiment Analysis",
    description: "Analyze the sentiment (positive, negative, neutral) of text data",
    demoLink: "/sentiment-analysis",
    icon: <Smile className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "Face Landmark Detection",
    description:
    "Detect and track facial landmarks (such as eyes, nose, mouth) in real-time using a pre-trained model.",
    demoLink: "",
    icon: <ScanFaceIcon className="h-12 w-12 text-purple-500" />,
  },
  
  {
    title: "Text Generation",
    description: "Generate human-like text using language models",
    demoLink: "",
    icon: <Edit className="h-12 w-12 text-purple-500" />,
  },
  
  // {
  //   title: "Image Classification",
  //   description:
  //     "Classify images into predefined categories using TensorFlow.js",
  //   demoLink: "",
  //   icon: <ImageIcon className="h-12 w-12 text-purple-500" />,
  // },
  {
    title: "Pose Estimation",
    description: "Estimate human pose from images or video in real-time",
    demoLink: "",
    icon: <UserPlus className="h-12 w-12 text-purple-500" />,
  },
  // {
  //   title: "Speech Recognition",
  //   description: "Convert spoken language into written text",
  //   demoLink: "",
  //   icon: <Mic className="h-12 w-12 text-purple-500" />,
  // },
  // {
  //   title: "Style Transfer",
  //   description: "Apply artistic styles to images using neural networks",
  //   demoLink: "",
  //   icon: <ImageIcon className="h-12 w-12 text-purple-500" />,
  // },
];

export function BlockPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <nav className="bg-black bg-opacity-50 backdrop-blur-lg sticky top-0 z-10 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AI-Storm
              </span>
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <header className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
          <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-600 to-white dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
              AI-Storm - The Future of Web AI
            </h2>
            <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-500 dark:text-neutral-400 text-center">
              Experience cutting-edge AI models powered by TensorFlow.js and
              Next.js
            </p>
          </BackgroundLines>
        </header>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-xl lg:text-3xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Explore Our AI Models
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {aiModels.map((model, index) => (
              <Card
                key={index}
                className="bg-gray-900 border-gray-800 text-gray-100 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <CardHeader className="flex flex-col items-center">
                  <div className="mb-4">{model.icon}</div>
                  <CardTitle className="text-xl font-semibold text-center">
                    {model.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    {model.description}
                  </p>
                </CardContent>
                <CardFooter>
                  {model.demoLink ? (
                    // Live Demo button when demoLink is available
                    <Link href={model.demoLink} passHref className="w-full">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-all hover:from-purple-600 hover:to-pink-600">
                        Live Demo
                      </Button>
                    </Link>
                  ) : (
                    // Coming Soon button when demoLink is not available
                    <Button
                      className="w-full bg-gray-600 text-gray-400 cursor-not-allowed transition-all"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 mt-16 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BrainCircuit className="h-8 w-8 text-purple-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  AI-Storm
                </span>
              </div>
              <p className="text-gray-400">
                Pushing the boundaries of AI with interactive web demos.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/Farmaan16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <GithubIcon className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <TwitterIcon className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="https://linkedin.com/in/mohammedfarman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <LinkedinIcon className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} AI-Storm. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
