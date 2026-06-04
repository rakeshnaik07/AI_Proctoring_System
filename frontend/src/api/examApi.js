import api from "./axios";

export const getExams = async () => {
  const response = await api.get("/exams");
  return response.data;
};

export const startExam = async (examId) => {
  const response = await api.post("/exams/start", {
    examId,
  });

  return response.data;
};

export const getQuestions = async (examId) => {
  const response = await api.get(
    `/exams/${examId}/questions`
  );

  return response.data;
};

export const submitExam = async (attemptId) => {
  const response = await api.put(
    "/exams/submit",
    {
      attemptId,
    }
  );

  return response.data;
};

export const createExam = async (examData) => {
  const response = await api.post("/exams", examData);
  return response.data;
};

export const addQuestion = async (questionData) => {
  const response = await api.post(
    "/exams/questions",
    questionData
  );

  return response.data;
};

export const saveAnswer = async (
  attemptId,
  questionId,
  selectedAnswer
) => {
  const response = await api.post(
    "/exams/save-answer",
    {
      attemptId,
      questionId,
      selectedAnswer,
    }
  );

  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(
    `/exams/${id}`
  );

  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await api.delete(
    `/exams/questions/${id}`
  );

  return response.data;
};