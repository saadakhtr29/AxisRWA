import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="newsletter">
        <h3>Subscribe To Our Newsletter</h3>
        <form>
          <input type="email" placeholder="you@example.com" />
          <button type="submit">→</button>
        </form>
      </div>
      <div className="footer-links">
        <div>
          <h4>Products</h4>
          <p>Solar</p>
          <p>EV</p>
          <p>Real Estate</p>
        </div>
        <div>
          <h4>Legal</h4>
          <p>Terms</p>
          <p>Privacy</p>
        </div>
      </div>
      <div className="copy">
        © {new Date().getFullYear()} Axis RWA – All rights reserved.
      </div>
    </footer>
  );
}