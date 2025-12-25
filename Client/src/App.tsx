import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentForm from "./Pages/ParentForm";
import Societal from "./Pages/Societal";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/Login";
import SignupPage from "./Pages/Signup";
import ProfilePage from "./Pages/Profile";
import CelestialMapping  from './Pages/CelestialMapping';
import ProtectedRoute from "./components/ProtectedRoute";
import StudentInputPage from "./Pages/StudentInput";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        

        {/* Protected routes */}
        <Route
          path="/ParentForm"
          element={
            <ProtectedRoute>
              <ParentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Societal"
          element={
            <ProtectedRoute>
              <Societal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Celestialmapping"
          element={
            <ProtectedRoute>
              <CelestialMapping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Input"
          element={
            <ProtectedRoute>
              <StudentInputPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
