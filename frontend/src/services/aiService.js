import axios from "axios";

const AI_BASE_URL = "http://localhost:8000";

export const detectFace = async (imageBlob) => {
  try {
    const formData = new FormData();

    formData.append(
      "file",
      imageBlob,
      "frame.jpg"
    );

    const response = await axios.post(
      `${AI_BASE_URL}/detect-face`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Face Detection Error:", error);

    return {
      success: false,
      faces: 0,
    };
  }
};