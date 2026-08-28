import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;