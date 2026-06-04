import axiosInstance from "./axios";

export const createViolation = async (data) => {
    const response = await axiosInstance.post(
        "/violations",
        data
    );

    return response.data;
};

export const getViolations = async (attemptId) => {
    const response = await axiosInstance.get(
        `/violations/${attemptId}`
    );

    return response.data;
};