const express = require("express");

const router = express.Router();

const {
    createViolation,
    getViolationsByAttempt
} = require("../controllers/violationController");

const authMiddleware = require("../middleware/authMiddleware");

// Save violation
router.post(
    "/",
    authMiddleware,
    createViolation
);

// Get violations
router.get(
    "/:attemptId",
    authMiddleware,
    getViolationsByAttempt
);

module.exports = router;