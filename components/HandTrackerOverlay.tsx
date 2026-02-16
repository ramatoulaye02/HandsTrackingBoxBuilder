
import React, { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { HandData } from '../types';

interface HandTrackerOverlayProps {
  onHandUpdate: (data: HandData | null) => void;
  isActive: boolean;
}

const HandTrackerOverlay: React.FC<HandTrackerOverlayProps> = ({ onHandUpdate, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const landmarkerRef = useRef<HandLandmarker | null>(null);

  useEffect(() => {
    async function setupMediaPipe() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      landmarkerRef.current = handLandmarker;
      setIsLoaded(true);
    }

    setupMediaPipe();
  }, []);

  useEffect(() => {
    if (!isLoaded || !isActive) return;

    let animationId: number;

    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    };

    startCamera();

    const predict = () => {
      if (videoRef.current && landmarkerRef.current && videoRef.current.readyState >= 2) {
        const startTimeMs = performance.now();
        const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            
            // Draw landmarks for debug/UI
            landmarks.forEach(point => {
              ctx.beginPath();
              ctx.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, 2 * Math.PI);
              ctx.fillStyle = "#10b981";
              ctx.fill();
            });

            // Detect pinch gesture (Index tip to Thumb tip)
            const indexTip = landmarks[8];
            const thumbTip = landmarks[4];
            const dist = Math.sqrt(
              Math.pow(indexTip.x - thumbTip.x, 2) + 
              Math.pow(indexTip.y - thumbTip.y, 2)
            );

            // Detect "open hand" by looking at finger extension
            const middleTip = landmarks[12];
            const middleBase = landmarks[9];
            const isOpen = middleTip.y < middleBase.y;

            let gesture: HandData['gesture'] = 'none';
            if (dist < 0.05) gesture = 'pinch';
            else if (isOpen) gesture = 'open';
            else gesture = 'closed';

            onHandUpdate({ landmarks, gesture });
          } else {
            onHandUpdate(null);
          }
        }
      }
      animationId = requestAnimationFrame(predict);
    };

    animationId = requestAnimationFrame(predict);

    return () => {
      cancelAnimationFrame(animationId);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLoaded, isActive, onHandUpdate]);

  return (
    <div className="fixed bottom-4 right-4 w-64 h-48 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 z-50">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur rounded text-[10px] font-bold text-emerald-400">
        LIVE TRACKING
      </div>
    </div>
  );
};

export default HandTrackerOverlay;
