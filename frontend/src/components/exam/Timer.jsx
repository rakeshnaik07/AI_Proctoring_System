import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const Timer = ({ minutes }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const isWarning = timeLeft <= 300; // under 5 mins
  const isDanger = timeLeft <= 60;   // under 1 min

  return (
    <span className={`text-sm font-semibold font-mono tabular-nums ${
      isDanger
        ? "text-red-600"
        : isWarning
        ? "text-amber-600"
        : "text-amber-700"
    }`}>
      {mins}:{secs < 10 ? `0${secs}` : secs}
    </span>
  );
};

export default Timer;