import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignupPage from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}
