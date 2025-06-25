import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">Axis <b>RWA</b></span>
        <ul className="nav-links">
          <li><a href="/">Marketplace</a></li>
          <li><a href="/">How It Works</a></li>
          <li><a href="/">Home</a></li>
        </ul>
      </div>
      <button className="get-started">GET STARTED</button>
    </nav>
  );
}