// const ExamCard = ({
//   exam,
//   onStart,
// }) => {
//   return (
//     <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
//       <h2 className="text-xl font-bold">
//         {exam.title}
//       </h2>

//       <p className="text-zinc-400 mt-2">
//         {exam.description}
//       </p>

//       <p className="mt-4">
//         Duration: {exam.duration} mins
//       </p>

//       <button
//         onClick={() => onStart(exam.id)}
//         className="mt-5 bg-white text-black px-4 py-2 rounded-lg"
//       >
//         Start Exam
//       </button>
//     </div>
//   );
// };

// export default ExamCard;

import { Clock, FileText } from "lucide-react";

const ExamCard = ({ exam, onStart }) => {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 transition-colors">

      {/* Badge */}
      <span className="inline-block text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded mb-3 uppercase tracking-wide">
        ● Available
      </span>

      {/* Title */}
      <h2 className="text-sm font-semibold text-zinc-900 mb-1">
        {exam.title}
      </h2>

      {/* Description */}
      <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
        {exam.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock size={12} />
          {exam.duration} mins
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <FileText size={12} />
          MCQ
        </span>
      </div>

      {/* Divider + Action */}
      <div className="border-t border-zinc-100 pt-3">
        <button
          onClick={() => onStart(exam.id)}
          className="text-xs font-semibold bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Start Exam →
        </button>
      </div>

    </div>
  );
};

export default ExamCard;