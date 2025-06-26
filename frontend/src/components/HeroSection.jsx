import "../styles/HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>TRANSPARENT BLOCKCHAIN INVESTMENTS. TANGIBLE RETURNS.</h1>
        <p>
          Invest in tokenized real-world assets on Ethereum. Fractional. SEC 20
          terms.
        </p>
        {/* <button>Explore Marketplace</button> */}
      </div>
      <div className="hero-animation">
        <span className="hero-animation-box">
          <div className="hero-animation-box-content"></div>
          <div className="hero-animation-box-content-content"></div>
        </span>
      </div>
      <div className="cards-container">
          <div className="cards">
            {/* <h2></h2> */}
            {/* <p>Invest in tokenized real-world assets on Ethereum.</p> */}
          </div>
          <div className="cards">
            {/* <h2 className="card-title"></h2> */}
            {/* <p>Fractional. Fractional. Fractional.</p> */}
          </div>
          <div className="cards">
            {/* <h2 className="card-title"></h2> */}
            {/* <p>Invest in tokenized real-world assets on Ethereum.</p> */}
          </div>
        </div>
    </section>
  );
}
