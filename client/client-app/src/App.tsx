/** @jsxImportSource @emotion/react */
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import PrivateRoute from "./auth/PrivateRoute";
import Home from "./pages/Home";
import UserDetail from "./pages/User/UserDetail";
import MainLayout from "./layouts/MainLayout";
import UsersList from "./pages/User/UsersList";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />

      <Route element={<MainLayout />}>
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/userdetail"
          element={
            <PrivateRoute>
              <UserDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/edit/:username"
          element={
            <PrivateRoute>
              <UserDetail isEditMode={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/userslist"
          element={
            <PrivateRoute>
              <UsersList />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
