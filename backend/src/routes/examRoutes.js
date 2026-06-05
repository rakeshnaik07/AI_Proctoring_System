const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createExam,
    getExams,
    addQuestion,
    getQuestionsByExam,
    startExamAttempt,
    saveAnswer,
    submitExam,
    getResults,
    deleteExam,
    deleteQuestion,
    getResultPDF,
} = require("../controllers/examController");

router.post("/", authMiddleware, adminMiddleware, createExam);
router.get("/", authMiddleware, getExams);
router.post("/questions", authMiddleware, adminMiddleware, addQuestion);
router.get("/:examId/questions", authMiddleware, getQuestionsByExam);
router.post("/start", authMiddleware, startExamAttempt);
router.put("/submit", authMiddleware, submitExam);
router.post("/save-answer", authMiddleware, saveAnswer);
router.get("/results", authMiddleware, getResults);
router.get("/result-pdf/:attemptId", authMiddleware, getResultPDF);
router.delete("/:id", authMiddleware, adminMiddleware, deleteExam);
router.delete("/questions/:id", authMiddleware, adminMiddleware, deleteQuestion);

module.exports = router;