import { useEffect, useState } from "react";

const Timer = ({ minutes }) => {
  const [timeLeft, setTimeLeft] =
    useState(minutes * 60);

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

  const mins = Math.floor(
    timeLeft / 60
  );

  const secs = timeLeft % 60;

  return (
    <div className="bg-red-500 px-4 py-2 rounded">
      {mins}:
      {secs < 10
        ? `0${secs}`
        : secs}
    </div>
  );
};

export default Timer;