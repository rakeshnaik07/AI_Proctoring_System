import { useEffect, useRef } from "react";

function useAIViolations({
  noFace,
  multipleFaces,
  poseViolation,
  attemptId,
  createViolation,
}) {
  const lastNoFace = useRef(false);
  const lastMultipleFace = useRef(false);
  const lastPoseViolation = useRef(null);

  useEffect(() => {
    if (!attemptId) return;

    if (noFace && !lastNoFace.current) {
      createViolation("NO_FACE");
      lastNoFace.current = true;
    }

    if (!noFace) {
      lastNoFace.current = false;
    }
  }, [noFace, attemptId, createViolation]);

  useEffect(() => {
    if (!attemptId) return;

    if (multipleFaces && !lastMultipleFace.current) {
      createViolation("MULTIPLE_FACE");
      lastMultipleFace.current = true;
    }

    if (!multipleFaces) {
      lastMultipleFace.current = false;
    }
  }, [multipleFaces, attemptId, createViolation]);

  useEffect(() => {
    if (!attemptId) return;

    if (poseViolation && lastPoseViolation.current !== poseViolation) {
      createViolation(poseViolation);
      lastPoseViolation.current = poseViolation;
    }

    if (!poseViolation) {
      lastPoseViolation.current = null;
    }
  }, [poseViolation, attemptId, createViolation]);
}

export default useAIViolations;
