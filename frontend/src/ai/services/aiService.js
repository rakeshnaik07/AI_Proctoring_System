import axios from "axios";

const AI_SERVER_URL = "http://localhost:8000";

const createFrameFormData = (imageBlob) => {
  const formData = new FormData();
  formData.append("file", imageBlob, "frame.jpg");
  return formData;
};

export const analyzeFrame = async (imageBlob) => {
  try {
    const response = await axios.post(
      `${AI_SERVER_URL}/analyze-frame`,
      createFrameFormData(imageBlob),
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Frame Analysis Error:", error);
    return {
      success: false,
      faces: 0,
      direction: "FORWARD",
      poseSuspicious: false,
      suspicious: false,
      violations: [],
    };
  }
};

export const detectFace = async (imageBlob) => {
  try {
    const response = await axios.post(
      `${AI_SERVER_URL}/detect-face`,
      createFrameFormData(imageBlob),
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Face Detection Error:", error);
    return { success: false, faces: 0 };
  }
};

export const detectPose = async (imageBlob) => {
  try {
    const response = await axios.post(
      `${AI_SERVER_URL}/detect-pose`,
      createFrameFormData(imageBlob),
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Pose Detection Error:", error);
    return { success: false, direction: "FORWARD", suspicious: false };
  }
};
