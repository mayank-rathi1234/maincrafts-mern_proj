import { Link } from 'react-router-dom';
import logoFooter from '../assets/logo-footer.png';

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo" aria-label="MainCrafts Technology – home">
            <img src={logoFooter} alt="MainCrafts Technology" className="logo-img logo-img-footer" />
          </Link>
          <p>Empowering the next generation of full-stack developers — one project at a time.</p>
          <div className="footer-social" aria-label="Social media links">
            <a href="javascript:void(0)" className="social-btn" aria-label="Twitter"><i className="fa-brands fa-x-twitter" aria-hidden="true"></i></a>
            <a href="javascript:void(0)" className="social-btn" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
            <a href="javascript:void(0)" className="social-btn" aria-label="GitHub"><i className="fa-brands fa-github" aria-hidden="true"></i></a>
            <a href="javascript:void(0)" className="social-btn" aria-label="Instagram"><i className="fa-brands fa-instagram" aria-hidden="true"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><a href="javascript:void(0)">Careers</a></li>
            <li><a href="javascript:void(0)">Blog</a></li>
            <li><a href="javascript:void(0)">Press</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="/#services">Web Design</a></li>
            <li><a href="/#services">App Development</a></li>
            <li><a href="/#services">Cloud Hosting</a></li>
            <li><a href="/#services">SEO &amp; Analytics</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Get In Touch</h4>
          <ul>
            <li><a href="mailto:hr@maincrafts.com"><i className="fa-solid fa-envelope fa-fw" aria-hidden="true"></i> hr@maincrafts.com</a></li>
            <li><a href="https://www.maincrafts.com"><i className="fa-solid fa-globe fa-fw" aria-hidden="true"></i> www.maincrafts.com</a></li>
            <li><Link to="/contact"><i className="fa-solid fa-paper-plane fa-fw" aria-hidden="true"></i> Contact form</Link></li>
            <li><Link to="/submissions"><i className="fa-solid fa-inbox fa-fw" aria-hidden="true"></i> Submissions</Link></li>
            <li><Link to="/dashboard"><i className="fa-solid fa-list-check fa-fw" aria-hidden="true"></i> Task Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 MainCrafts Technology. All rights reserved.</span>
        <div className="footer-links">
          <a href="javascript:void(0)">Privacy Policy</a>
          <a href="javascript:void(0)">Terms of Use</a>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
