import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentForm from "./Pages/ParentForm";
import Societal from "./Pages/Societal";
import LandingPage from "./Pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/ParentForm" element={<ParentForm />} />

        {/* Other page */}
        <Route path="/Societal" element={<Societal />} />

        {/* You can add more pages here */}
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
