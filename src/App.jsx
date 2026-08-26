import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { AdminPlaceholder } from "./pages/AdminPlaceholder.jsx";
import { StudentPlaceholder } from "./pages/StudentPlaceholder.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPlaceholder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentPlaceholder />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;