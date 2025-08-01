/** @jsxImportSource @emotion/react */
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import PrivateRoute from "./auth/PrivateRoute";
import Home from "./pages/Home";
import UserDetail from "./pages/User/UserDetail";
import TripDetail from "./pages/Trip/TripDetail";
import MainLayout from "./layouts/MainLayout";
import UsersList from "./pages/User/UsersList";
import TripsList from "./pages/Trip/TripsList";

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
          path="/user/create"
          element={
            <PrivateRoute>
              <UserDetail isNewMode={true} />
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
        <Route
          path="/trip/create"
          element={
            <PrivateRoute>
              <TripDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/trip/tripdetail"
          element={
            <PrivateRoute>
              <TripDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/trips/edit/:id"
          element={
            <PrivateRoute>
              <TripDetail isEditMode={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/trip/tripslist"
          element={
            <PrivateRoute>
              <TripsList />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
