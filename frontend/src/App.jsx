import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard / Protected Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Exams from "./pages/exam/Exams";
import Profile from "./pages/dashboard/Profile";

//exam 
import ExamInstructions from "./pages/exam/ExamInstructions";
import ExamAttempt from "./pages/exam/ExamAttempt";
//admin exam creation 
import CreateExam from "./pages/admin/CreateExam";
import AddQuestion from "./pages/admin/AddQuestion";
import ManageExams from "./pages/admin/ManageExams";
import ManageQuestions from "./pages/admin/ManageQuestions";

//results
import Results from "./pages/exam/Results";
// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
  <Route path="/exams" element={<Exams />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/exam/:examId" element={<ExamInstructions />} />
  <Route path="/exam/:examId/attempt" element={<ExamAttempt />} />
  <Route path="/admin/create-exam"element={<CreateExam />}/>

<Route path="/admin/add-question"element={<AddQuestion />}/>
<Route
  path="/results"
  element={<Results />}
/>
<Route
  path="/admin/manage-exams"
  element={<ManageExams />}
/>

<Route
  path="/admin/questions/:examId"
  element={<ManageQuestions />}
/>
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;