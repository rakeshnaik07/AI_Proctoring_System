const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const examRoutes = require("./routes/examRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const violationRoutes = require("./routes/violationRoutes");
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exams",examRoutes);
app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
    "/api/violations",
    violationRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "AI Proctoring Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});