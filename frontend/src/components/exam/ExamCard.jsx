const ExamCard = ({
  exam,
  onStart,
}) => {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h2 className="text-xl font-bold">
        {exam.title}
      </h2>

      <p className="text-zinc-400 mt-2">
        {exam.description}
      </p>

      <p className="mt-4">
        Duration: {exam.duration} mins
      </p>

      <button
        onClick={() => onStart(exam.id)}
        className="mt-5 bg-white text-black px-4 py-2 rounded-lg"
      >
        Start Exam
      </button>
    </div>
  );
};

export default ExamCard;