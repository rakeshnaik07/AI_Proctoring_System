const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {

    const userId = req.user.id;

    const [[totalExams]] = await pool.query(
      `
      SELECT COUNT(*) AS totalExams
      FROM exams
      `
    );

    const [[completedExams]] = await pool.query(
      `
      SELECT COUNT(*) AS completedExams
      FROM exam_attempts
      WHERE user_id = ?
      AND status = 'completed'
      `,
      [userId]
    );

    const pendingExams =
      totalExams.totalExams -
      completedExams.completedExams;

    res.status(200).json({
      totalExams: totalExams.totalExams,
      completedExams:
        completedExams.completedExams,
      pendingExams,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  getDashboardStats,
};