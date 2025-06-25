import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}