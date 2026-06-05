const express = require("express");

const router = express.Router();

const {
    createViolation,
    getViolationsByAttempt,
    getAllAttemptsWithViolations
} = require("../controllers/violationController");

const authMiddleware = require("../middleware/authMiddleware");

// Save violation
router.post("/", authMiddleware, createViolation);

// Get all attempts with violation summary — admin dashboard
router.get("/admin/all-attempts", authMiddleware, getAllAttemptsWithViolations);

// Get violations by attempt
router.get("/:attemptId", authMiddleware, getViolationsByAttempt);

module.exports = router;