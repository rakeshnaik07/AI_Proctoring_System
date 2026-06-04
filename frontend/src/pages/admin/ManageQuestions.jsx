import { useEffect, useState } from "react";

import {
  getQuestions,
  deleteQuestion,
} from "../../api/examApi";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

const ManageQuestions = () => {
  const { examId } = useParams();

  const [questions, setQuestions] =
    useState([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {

      const data =
        await getQuestions(examId);

      setQuestions(data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleDelete = async (
    questionId
  ) => {
    try {

      await deleteQuestion(
        questionId
      );

      toast.success(
        "Question Deleted"
      );

      loadQuestions();

    } catch (error) {

      toast.error(
        "Delete Failed"
      );

    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Manage Questions
      </h1>

      <div className="space-y-4">
        {questions.map(
          (question) => (
            <div
              key={question.id}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
            >
              <h2 className="font-bold text-lg">
                {question.question}
              </h2>

              <ul className="mt-4 space-y-2">
                <li>
                  A.
                  {
                    question.option_a
                  }
                </li>

                <li>
                  B.
                  {
                    question.option_b
                  }
                </li>

                <li>
                  C.
                  {
                    question.option_c
                  }
                </li>

                <li>
                  D.
                  {
                    question.option_d
                  }
                </li>
              </ul>

              <button
                onClick={() =>
                  handleDelete(
                    question.id
                  )
                }
                className="mt-4 bg-red-500 px-4 py-2 rounded"
              >
                Delete Question
              </button>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageQuestions;