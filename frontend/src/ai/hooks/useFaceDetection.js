import { useEffect, useRef, useState } from "react";

import { analyzeFrame } from "../services/aiService";
import { captureFrame } from "../utils/captureFrame";

const STABILITY_THRESHOLD = 3;

const getPoseViolation = (violations = []) => {
  if (violations.includes("LOOKING_DOWN")) return "LOOKING_DOWN";
  if (violations.includes("LOOKING_AWAY")) return "LOOKING_AWAY";
  return null;
};

function useFaceDetection(videoRef) {
  const [faces, setFaces] = useState(0);
  const [stableNoFace, setStableNoFace] = useState(false);
  const [stableMultipleFaces, setStableMultipleFaces] = useState(false);
  const [direction, setDirection] = useState("FORWARD");
  const [stableSuspicious, setStableSuspicious] = useState(false);
  const [stablePoseViolation, setStablePoseViolation] = useState(null);
  const [livePoseViolation, setLivePoseViolation] = useState(null);
  const [poseViolationProgress, setPoseViolationProgress] = useState(0);

  const noFaceCount = useRef(0);
  const multipleFaceCount = useRef(0);
  const poseViolationCount = useRef(0);
  const lastPoseViolation = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const interval = setInterval(async () => {
      try {
        const blob = await captureFrame(videoRef.current);
        if (!blob) return;

        const analysisResult = await analyzeFrame(blob);

        const detectedFaces = analysisResult.faces || 0;
        setFaces(detectedFaces);

        if (detectedFaces === 0) {
          noFaceCount.current += 1;
        } else {
          noFaceCount.current = 0;
          setStableNoFace(false);
        }

        if (noFaceCount.current >= STABILITY_THRESHOLD) {
          setStableNoFace(true);
        }

        if (detectedFaces > 1) {
          multipleFaceCount.current += 1;
        } else {
          multipleFaceCount.current = 0;
          setStableMultipleFaces(false);
        }

        if (multipleFaceCount.current >= STABILITY_THRESHOLD) {
          setStableMultipleFaces(true);
        }

        const currentDirection = analysisResult.direction || "FORWARD";
        const currentPoseViolation = getPoseViolation(analysisResult.violations);

        setDirection(currentDirection);

        if (currentPoseViolation) {
          setLivePoseViolation(currentPoseViolation);

          if (lastPoseViolation.current === currentPoseViolation) {
            poseViolationCount.current += 1;
          } else {
            lastPoseViolation.current = currentPoseViolation;
            poseViolationCount.current = 1;
            setStableSuspicious(false);
            setStablePoseViolation(null);
          }

          setPoseViolationProgress(
            Math.min(poseViolationCount.current, STABILITY_THRESHOLD)
          );
        } else {
          lastPoseViolation.current = null;
          poseViolationCount.current = 0;
          setLivePoseViolation(null);
          setPoseViolationProgress(0);
          setStableSuspicious(false);
          setStablePoseViolation(null);
        }

        if (poseViolationCount.current >= STABILITY_THRESHOLD) {
          setStableSuspicious(true);
          setStablePoseViolation(currentPoseViolation);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [videoRef]);

  return {
    faces,
    noFace: stableNoFace,
    multipleFaces: stableMultipleFaces,
    direction,
    livePoseViolation,
    poseViolation: stablePoseViolation,
    poseViolationProgress,
    requiredPoseFrames: STABILITY_THRESHOLD,
    suspiciousMovement: stableSuspicious,
  };
}

export default useFaceDetection;
