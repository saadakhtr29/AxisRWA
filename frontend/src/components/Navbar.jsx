import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import "../styles/Navbar.css"

export default function Navbar() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="links">
          <a href="/">Marketplace</a>
          <a href="/">How It Works</a>
          <a href="/">Home</a>
        </div>
        <span className="logo">
          Axis <b>RWA</b>
        </span>
      </div>
      {isConnected && (
        <span className="wallet-address">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
      <button className="get-started" onClick={() => navigate("/signup")}>
        GET STARTED
      </button>
    </nav>
  );
}
