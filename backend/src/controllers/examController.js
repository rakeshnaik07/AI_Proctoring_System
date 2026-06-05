const pool = require("../config/db");
const { generateResultPDF } = require("../utils/pdfGenerator");

const createExam = async (req, res) => {
    try {
        const { title, description, duration } = req.body;
        await pool.query(
            `INSERT INTO exams (title, description, duration) VALUES (?, ?, ?)`,
            [title, description, duration]
        );
        res.status(201).json({ message: "Exam Created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getExams = async (req, res) => {
    try {
        const [exams] = await pool.query("SELECT * FROM exams");
        res.status(200).json(exams);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addQuestion = async (req, res) => {
    try {
        const { examId, question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
        await pool.query(
            `INSERT INTO questions (exam_id, question, option_a, option_b, option_c, option_d, correct_answer)
             VALUES (?,?,?,?,?,?,?)`,
            [examId, question, optionA, optionB, optionC, optionD, correctAnswer]
        );
        res.status(201).json({ message: "Question Added Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getQuestionsByExam = async (req, res) => {
    try {
        const examId = req.params.examId;
        const [questions] = await pool.query(
            `SELECT id, question, option_a, option_b, option_c, option_d FROM questions WHERE exam_id = ?`,
            [examId]
        );
        res.status(200).json(questions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const startExamAttempt = async (req, res) => {
    try {
        const userId = req.user.id;
        const { examId } = req.body;
        const [result] = await pool.query(
            `INSERT INTO exam_attempts (user_id, exam_id) VALUES (?,?)`,
            [userId, examId]
        );
        res.status(201).json({ message: "Exam Started", attemptId: result.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const submitExam = async (req, res) => {
    try {
        const { attemptId } = req.body;
        const [answers] = await pool.query(
            `SELECT a.selected_answer, q.correct_answer
             FROM answers a JOIN questions q ON a.question_id = q.id
             WHERE a.attempt_id = ?`,
            [attemptId]
        );

        let score = 0;
        answers.forEach((answer) => {
            if (answer.selected_answer === answer.correct_answer) score++;
        });

        await pool.query(
            `UPDATE exam_attempts SET status = 'completed', end_time = NOW(), score = ? WHERE id = ?`,
            [score, attemptId]
        );

        res.status(200).json({ message: "Exam Submitted Successfully", score });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const saveAnswer = async (req, res) => {
    try {
        const { attemptId, questionId, selectedAnswer } = req.body;
        await pool.query(
            `INSERT INTO answers (attempt_id, question_id, selected_answer)
             VALUES (?,?,?)
             ON DUPLICATE KEY UPDATE selected_answer = VALUES(selected_answer)`,
            [attemptId, questionId, selectedAnswer]
        );
        res.status(201).json({ message: "Answer Saved" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getResults = async (req, res) => {
    try {
        const userId = req.user.id;
        const [results] = await pool.query(
            `SELECT ea.id, e.title, ea.score, ea.status, ea.start_time, ea.end_time
             FROM exam_attempts ea JOIN exams e ON ea.exam_id = e.id
             WHERE ea.user_id = ? ORDER BY ea.id DESC`,
            [userId]
        );
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteExam = async (req, res) => {
    try {
        await pool.query(`DELETE FROM exams WHERE id = ?`, [req.params.id]);
        res.status(200).json({ message: "Exam Deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        await pool.query(`DELETE FROM questions WHERE id = ?`, [req.params.id]);
        res.status(200).json({ message: "Question Deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Result PDF — fetches all questions, answers, correct answers and streams PDF
const getResultPDF = async (req, res) => {
    try {
        const { attemptId } = req.params;

        // Get attempt + exam info
        const [[attempt]] = await pool.query(
            `SELECT ea.id, ea.score, ea.end_time, e.title AS examTitle, u.name AS studentName
             FROM exam_attempts ea
             JOIN exams e ON ea.exam_id = e.id
             JOIN users u ON ea.user_id = u.id
             WHERE ea.id = ?`,
            [attemptId]
        );

        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }

        // Get all questions with student answer and correct answer
        const [questions] = await pool.query(
            `SELECT
                q.question,
                q.option_a, q.option_b, q.option_c, q.option_d,
                q.correct_answer,
                a.selected_answer
             FROM questions q
             LEFT JOIN answers a ON a.question_id = q.id AND a.attempt_id = ?
             WHERE q.exam_id = (
                SELECT exam_id FROM exam_attempts WHERE id = ?
             )
             ORDER BY q.id ASC`,
            [attemptId, attemptId]
        );

        const pdfBuffer = await generateResultPDF({ attempt, questions });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="result-${attemptId}.pdf"`
        );
        res.send(pdfBuffer);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
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
};