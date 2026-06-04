const pool = require("../config/db");

// Save Violation
const createViolation = async (req, res) => {
    try {

        const { attemptId, violationType, confidence } = req.body;

        // Prevent duplicate violations within 5 seconds
        const [existing] = await pool.query(
            `SELECT id
             FROM violations
             WHERE attempt_id = ?
             AND violation_type = ?
             AND created_at > NOW() - INTERVAL 5 SECOND`,
            [attemptId, violationType]
        );

        if (existing.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Violation already recorded recently"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO violations
            (attempt_id, violation_type, confidence)
            VALUES (?, ?, ?)`,
            [
                attemptId,
                violationType,
                confidence || 1
            ]
        );

        res.status(201).json({
            success: true,
            message: "Violation Recorded",
            violationId: result.insertId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};


// Get Violations By Attempt
const getViolationsByAttempt = async (req, res) => {
    try {

        const { attemptId } = req.params;

        const [violations] = await pool.query(
            `SELECT *
            FROM violations
            WHERE attempt_id = ?
            ORDER BY created_at DESC`,
            [attemptId]
        );

        res.status(200).json({
            success: true,
            violations
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    createViolation,
    getViolationsByAttempt
};