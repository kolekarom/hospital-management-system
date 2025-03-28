import { Link } from "react-router-dom"
import "./Home.css"

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Blockchain-Powered Healthcare Management</h1>
          <p className="hero-subtitle">
            Secure, transparent, and efficient hospital management system built on blockchain technology. Empowering
            doctors and patients with decentralized healthcare records.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <a href="#features" className="btn btn-outline btn-lg">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src="/Users/omkolekar/hospital-management-system/images/hero.jpeg" alt="Hospital Management System" />
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure Patient Records</h3>
            <p className="feature-description">
              Patient data securely stored on the blockchain, ensuring privacy and immutability.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3 className="feature-title">Doctor Management</h3>
            <p className="feature-description">Efficient doctor onboarding and management through admin dashboard.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔑</div>
            <h3 className="feature-title">MetaMask Authentication</h3>
            <p className="feature-description">Secure blockchain-based authentication using MetaMask wallet.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Powered Chatbot</h3>
            <p className="feature-description">
              Intelligent chatbot to guide patients and doctors through the platform.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Decentralized Storage</h3>
            <p className="feature-description">Medical records stored on blockchain for transparency and security.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Role-Based Access</h3>
            <p className="feature-description">Customized dashboards for patients, doctors, and administrators.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Connect Your Wallet</h3>
            <p className="step-description">Use MetaMask to securely authenticate and access the platform.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Register Your Profile</h3>
            <p className="step-description">Create your profile as a patient or get registered as a doctor by admin.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Manage Health Records</h3>
            <p className="step-description">Doctors create and update patient records securely on the blockchain.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3 className="step-title">Access Anywhere</h3>
            <p className="step-description">
              Access your medical history anytime, anywhere with proper authentication.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-content">
          <h2 className="section-title">About MediChain</h2>
          <p className="about-description">
            MediChain is a revolutionary blockchain-based hospital management system designed to transform healthcare
            record-keeping. By leveraging the power of blockchain technology, we ensure that medical records are secure,
            immutable, and accessible only to authorized personnel.
          </p>
          <p className="about-description">
            Our platform connects patients, doctors, and administrators in a secure ecosystem where data privacy is
            paramount. With features like decentralized storage, smart contract-based access control, and transparent
            record-keeping, MediChain is setting new standards for healthcare management.
          </p>
        </div>
        <div className="about-image">
          <img src="/images/about-image.png" alt="About MediChain" />
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Ready to Transform Healthcare Management?</h2>
        <p className="cta-description">
          Join MediChain today and experience the future of secure, blockchain-powered healthcare.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg">
          Get Started Now
        </Link>
      </section>
    </div>
  )
}

export default Home

