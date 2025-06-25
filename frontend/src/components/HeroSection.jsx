import '../styles/HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>TRANSPARENT BLOCKCHAIN INVESTMENTS. TANGIBLE RETURNS.</h1>
        <p>Invest in tokenized real-world assets on Ethereum. Fractional. SEC 20 terms.</p>
        <div className="hero-search">
          <input type="text" placeholder="Search for assets..." />
          <button>→</button>
        </div>
      </div>
    </section>
  );
}