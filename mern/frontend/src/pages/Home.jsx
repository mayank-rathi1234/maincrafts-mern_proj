import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: 'fa-bolt', color: 'icon-blue', title: 'Blazing Fast', text: 'Optimised assets, lazy-loading, and lean code keep your page loading under one second—every time.' },
  { icon: 'fa-mobile-screen-button', color: 'icon-lblue', title: 'Fully Responsive', text: 'Fluid grids and breakpoints ensure a pixel-perfect experience across desktop, tablet, and mobile.' },
  { icon: 'fa-layer-group', color: 'icon-coral', title: 'Scalable Architecture', text: 'Clean semantic HTML5 and modular CSS3 so the codebase grows with your project without pain.' },
  { icon: 'fa-shield-halved', color: 'icon-gold', title: 'Secure by Default', text: 'Best-practice security headers, HTTPS-ready, and zero third-party trackers baked in from day one.' },
];

const SERVICES = [
  { icon: 'fa-palette', color: 'icon-blue', title: 'Web Design', text: 'Modern, on-brand interfaces designed for clarity, conversion, and accessibility.' },
  { icon: 'fa-mobile-screen', color: 'icon-lblue', title: 'App Development', text: 'Native-feeling web and mobile apps built on clean, maintainable code.' },
  { icon: 'fa-cloud', color: 'icon-coral', title: 'Cloud Hosting', text: 'Reliable, scalable infrastructure so your product stays online and fast.' },
  { icon: 'fa-chart-line', color: 'icon-gold', title: 'SEO & Analytics', text: 'Get found, get measured, and get better with data-driven optimisation.' },
];

export default function Home() {
  return (
    <main id="main-content">
      <section id="hero" aria-label="Hero">
        <div className="blob blob-1" aria-hidden="true"></div>
        <div className="blob blob-2" aria-hidden="true"></div>
        <div className="blob blob-3" aria-hidden="true"></div>
        <div className="hero-badge"><i className="fa-solid fa-bolt" aria-hidden="true"></i> Full Stack Web Development Internship</div>
        <h1>Build <em>Smarter</em> with<br /><span className="under">MainCrafts</span> 🚀</h1>
        <p>A visually stunning, fully responsive multi-page website built for a startup, personal portfolio, or product launch. Fast. Responsive. Scalable.</p>
        <div className="hero-btns">
          <a href="#features" className="btn-primary"><i className="fa-solid fa-rocket" aria-hidden="true"></i>&nbsp; Get Started</a>
          <Link to="/about" className="btn-outline">Learn More</Link>
        </div>
        <div className="hero-stats" role="list" aria-label="Company stats">
          <div className="stat" role="listitem"><strong>50+</strong><small>Projects Shipped</small></div>
          <div className="stat" role="listitem"><strong>99%</strong><small>Client Satisfaction</small></div>
          <div className="stat" role="listitem"><strong>5★</strong><small>Average Rating</small></div>
          <div className="stat" role="listitem"><strong>24/7</strong><small>Support</small></div>
        </div>
      </section>

      <div className="trust-bar" aria-label="Trusted by">
        <span>Trusted by teams at</span>
        <div className="trust-logos" aria-hidden="true">
          <span className="trust-logo">Acme Corp</span>
          <span className="trust-logo">NovaTech</span>
          <span className="trust-logo">Skylark</span>
          <span className="trust-logo">Pebble AI</span>
          <span className="trust-logo">Orion Labs</span>
        </div>
      </div>

      <section id="features" aria-labelledby="features-title">
        <div className="section-tag">⚙ Why MainCrafts</div>
        <h2 className="section-title" id="features-title">Everything you need to <span>launch</span> faster</h2>
        <p className="section-sub">Built with modern standards so your product looks stunning on every device, every time.</p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <article className="card" key={f.title}>
              <div className={`card-icon ${f.color}`} aria-hidden="true"><i className={`fa-solid ${f.icon}`}></i></div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" aria-labelledby="services-title" style={{ padding: '5.5rem 6vw', background: 'var(--soft)' }}>
        <div className="section-tag">🛠 Our Services</div>
        <h2 className="section-title" id="services-title">A full-stack team, <span>on demand</span></h2>
        <p className="section-sub">From pixel to production, we cover every layer of the stack.</p>
        <div className="features-grid">
          {SERVICES.map((s) => (
            <article className="card" key={s.title}>
              <div className={`card-icon ${s.color}`} aria-hidden="true"><i className={`fa-solid ${s.icon}`}></i></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
