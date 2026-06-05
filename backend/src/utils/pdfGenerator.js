const PDFDocument = require("pdfkit");

/**
 * Generates a result PDF buffer for a given attempt.
 * @param {Object} param0
 * @param {Object} param0.attempt - { examTitle, studentName, score, end_time }
 * @param {Array}  param0.questions - [{ question, option_a..d, correct_answer, selected_answer }]
 * @returns {Promise<Buffer>}
 */
const generateResultPDF = ({ attempt, questions }) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: "A4" });
        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        const pageWidth = doc.page.width - 100; // margins
        const correct = questions.filter(
            (q) => q.selected_answer === q.correct_answer
        ).length;
        const total = questions.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

        // ── Header ──────────────────────────────────────────────────────────
        doc.fontSize(20).font("Helvetica-Bold").text("ProctorAI", 50, 50);
        doc.fontSize(11).font("Helvetica").fillColor("#666").text("Exam Result Report", 50, 76);

        doc.moveTo(50, 95).lineTo(545, 95).strokeColor("#e4e4e7").stroke();

        // ── Exam Info ───────────────────────────────────────────────────────
        doc.fillColor("#000").fontSize(15).font("Helvetica-Bold").text(attempt.examTitle, 50, 110);
        doc.fontSize(10).font("Helvetica").fillColor("#555")
            .text(`Student: ${attempt.studentName}`, 50, 132)
            .text(
                `Submitted: ${attempt.end_time ? new Date(attempt.end_time).toLocaleString("en-IN") : "—"}`,
                50, 148
            );

        // ── Score Box ───────────────────────────────────────────────────────
        const scoreColor = percentage >= 80 ? "#16a34a" : percentage >= 50 ? "#d97706" : "#dc2626";
        const scoreLabel = percentage >= 80 ? "Excellent" : percentage >= 50 ? "Average" : "Low";

        doc.roundedRect(50, 170, pageWidth, 60, 8)
            .fillColor("#f4f4f5")
            .fill();

        doc.fontSize(22).font("Helvetica-Bold").fillColor(scoreColor)
            .text(`${percentage}%`, 70, 183);

        doc.fontSize(11).font("Helvetica-Bold").fillColor("#000")
            .text(`${correct} / ${total} Correct`, 130, 183);

        doc.fontSize(10).font("Helvetica").fillColor("#666")
            .text(scoreLabel, 130, 200);

        doc.moveTo(50, 245).lineTo(545, 245).strokeColor("#e4e4e7").stroke();

        // ── Questions ───────────────────────────────────────────────────────
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#000")
            .text("Questions & Answers", 50, 258);

        let y = 285;
        const optionLabels = { option_a: "A", option_b: "B", option_c: "C", option_d: "D" };

        questions.forEach((q, index) => {
            // Page break if needed
            if (y > 720) {
                doc.addPage();
                y = 50;
            }

            const isCorrect = q.selected_answer === q.correct_answer;
            const notAnswered = !q.selected_answer;

            // Question row background
            const bgColor = notAnswered ? "#fafafa" : isCorrect ? "#f0fdf4" : "#fff1f2";
            doc.roundedRect(50, y, pageWidth, 14, 3).fillColor(bgColor).fill();

            // Question number + text
            doc.fontSize(10).font("Helvetica-Bold").fillColor("#111")
                .text(`Q${index + 1}.`, 55, y + 2, { continued: true })
                .font("Helvetica")
                .text(` ${q.question}`, { width: pageWidth - 20 });

            y = doc.y + 6;

            // Options
            ["option_a", "option_b", "option_c", "option_d"].forEach((key) => {
                const label = optionLabels[key];
                const value = q[key];
                const isStudentAnswer = q.selected_answer === label;
                const isCorrectAnswer = q.correct_answer === label;

                let textColor = "#555";
                let prefix = "  ";

                if (isCorrectAnswer) textColor = "#16a34a";
                if (isStudentAnswer && !isCorrect) textColor = "#dc2626";

                const marker = isCorrectAnswer ? "✓" : isStudentAnswer ? "✗" : " ";

                doc.fontSize(9).font(isCorrectAnswer || isStudentAnswer ? "Helvetica-Bold" : "Helvetica")
                    .fillColor(textColor)
                    .text(`${prefix}${marker} ${label}. ${value}`, 65, doc.y + 2, { width: pageWidth - 20 });
            });

            // Status tag
            const tagText = notAnswered ? "Not Answered" : isCorrect ? "Correct" : "Wrong";
            const tagColor = notAnswered ? "#a1a1aa" : isCorrect ? "#16a34a" : "#dc2626";

            doc.fontSize(8).font("Helvetica-Bold").fillColor(tagColor)
                .text(tagText, 50, doc.y + 3, { align: "right", width: pageWidth });

            y = doc.y + 14;

            doc.moveTo(50, y).lineTo(545, y).strokeColor("#f0f0f0").lineWidth(0.5).stroke();
            y += 10;
        });

        // ── Footer ──────────────────────────────────────────────────────────
        doc.fontSize(8).font("Helvetica").fillColor("#aaa")
            .text("Generated by ProctorAI", 50, doc.page.height - 40, {
                align: "center",
                width: pageWidth,
            });

        doc.end();
    });
};

module.exports = { generateResultPDF };