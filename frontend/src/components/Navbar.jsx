import { useNavigate } from "react-router-dom";
import '../styles/Navbar.css';

export default function Navbar() {

  const navigate = useNavigate();
  return (
    <nav className="navbar-container">
      <div className="navbar">
      <div className="links">
          <a href="/">Marketplace</a>
          <a href="/">How It Works</a>
          <a href="/">Home</a>
        </div>
        <span className="logo">Axis <b>RWA</b></span>
      </div>
      <button className="get-started" onClick={() => navigate("/signup")}>GET STARTED</button>
    </nav>
  );
}