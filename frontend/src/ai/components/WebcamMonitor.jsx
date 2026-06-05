import { useEffect } from "react";

function WebcamMonitor({ videoRef }) {

  useEffect(() => {
    let stream = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
      }
    };

    startWebcam();

    // Cleanup: stop all tracks when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-48 h-36 rounded border"
    />
  );
}

export default WebcamMonitor;