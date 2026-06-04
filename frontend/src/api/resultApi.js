import api from "./axios";

export const getResults = async () => {
  const response = await api.get(
    "/exams/results"
  );

  return response.data;
};