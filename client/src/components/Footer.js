import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
        <hr />
        <br />
        <br />
      <div className="footer-container">
        {/* Footer Links */}
        <div className="footer-links">
          <h2>Enlaces</h2>
          <ul>
            <li><Link to="/">¿Qué hacemos?</Link></li>
            <li><Link to="/quiero-unirme">Quiero unirme</Link></li>
            <li><Link to="/inicia-sesion">Inicia sesión</Link></li>
            <li><Link to="/crear-cuenta">Crear cuenta</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-contact">
          <h2>Contáctanos</h2>
          <p>
            <FaPhone className="footer-icon" />
            <a href="tel:+573102136026"> +57 3102136026</a>
          </p>
          <p>
            <FaEnvelope className="footer-icon" />
            <a href="mailto:jeronimo.morales@cesa.edu.co"> jeronimo.morales@cesa.edu.co</a>
          </p>
        </div>

        {/* Social Media Links */}
        <div className="footer-social">
          <h2>Síguenos</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Todos los derechos reservados | Ingenieros Marketplace</p>
      </div>
    </footer>
  );
};

export default Footer;
