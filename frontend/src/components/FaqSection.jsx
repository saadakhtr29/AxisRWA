import '../styles/FaqSection.css';

export default function FaqSection() {
  return (
    <section className="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-grid">
        <details>
          <summary>What is AXIS RWA?</summary>
          <p>A platform to invest in real-world assets via blockchain tokens.</p>
        </details>
        <details>
          <summary>How do I invest?</summary>
          <p>Sign up, verify KYC, choose asset, and invest using crypto.</p>
        </details>
        <details>
          <summary>Is it secure?</summary>
          <p>Yes, we follow ERC-3643 and SEC-compliant practices.</p>
        </details>
      </div>
    </section>
  );
}