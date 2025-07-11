/** @jsxImportSource @emotion/react */
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
