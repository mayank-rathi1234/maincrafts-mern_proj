const OFFERS = [
  { icon: 'fa-graduation-cap', title: 'Mentorship', text: 'Hands-on code review from working engineers.' },
  { icon: 'fa-diagram-project', title: 'Real Projects', text: 'Multi-page sites, APIs, and full applications.' },
  { icon: 'fa-users', title: 'Community', text: 'A network of alumni now working across the industry.' },
  { icon: 'fa-briefcase', title: 'Portfolio-Ready', text: 'Ship work you can actually show employers.' },
];

const TIMELINE = [
  { year: '2022', title: 'Founded in a two-person garage office', text: 'MainCrafts started as a freelance web studio taking on small business sites.' },
  { year: '2023', title: 'Launched the internship programme', text: 'The first cohort of 12 interns worked through our task-based curriculum.' },
  { year: '2024', title: 'Crossed 100 interns trained', text: 'Grew the mentor team and introduced full-stack and cloud tracks.' },
  { year: '2025', title: '120+ interns, 3 years in industry', text: 'Now supporting remote-friendly cohorts with real client work.' },
];

const VALUES = [
  { icon: 'fa-circle-check', color: 'icon-blue', title: 'Ship Real Work', text: 'Every task produces something you could put in a portfolio or hand to a client.' },
  { icon: 'fa-comments', color: 'icon-lblue', title: 'Honest Feedback', text: 'Mentors review code the way a senior engineer would — direct, specific, useful.' },
  { icon: 'fa-universal-access', color: 'icon-coral', title: 'Accessible by Default', text: 'We teach and build with semantic HTML, keyboard support, and responsive layouts.' },
  { icon: 'fa-seedling', color: 'icon-gold', title: 'Growth Over Perfection', text: 'Small, working iterations beat a perfect plan that never ships.' },
];

const TEAM = [
  { initials: 'RS', name: 'Riya Sharma', role: 'Founder & Lead Engineer', text: 'Full-stack developer and internship programme designer.' },
  { initials: 'AK', name: 'Arjun Kapoor', role: 'Frontend Mentor', text: 'Specialises in accessible, responsive interface design.' },
  { initials: 'MI', name: 'Meera Iyer', role: 'Backend Mentor', text: 'APIs, databases, and cloud infrastructure for young developers.' },
  { initials: 'DP', name: 'Dev Patel', role: 'Programme Coordinator', text: 'Keeps every cohort on track from Task 1 to final capstone.' },
];

export default function About() {
  return (
    <main id="main-content">
      <section className="page-header" aria-label="About page introduction">
        <div className="blob blob-1" aria-hidden="true"></div>
        <div className="blob blob-2" aria-hidden="true"></div>
        <span className="crumb"><i className="fa-solid fa-building" aria-hidden="true"></i> About MainCrafts</span>
        <h1>Crafting digital experiences that <span>matter</span></h1>
        <p>We turn ideas into polished, production-ready products. From solo interns to scale-up startups—everyone deserves great software.</p>
      </section>

      <section className="about-story">
        <div className="about-story-inner">
          <div className="about-copy">
            <div className="section-tag">✦ Our Story</div>
            <h2 className="section-title">Why we <span>started</span></h2>
            <p>MainCrafts Technology began with a simple observation: the gap between "knowing how to code" and "shipping real software" was leaving talented beginners behind. So we built a place to close that gap — real projects, real feedback, real portfolios.</p>
            <p>Today we run a structured full-stack internship programme that walks every trainee from a single landing page through to a complete, connected, production-style application — the same way our own engineering team ships products for clients.</p>
            <p>Every task in the programme, including this one, mirrors work our developers do every day: building interfaces, wiring up navigation, and validating the data users send us.</p>
          </div>
          <div className="about-visual-grid" role="list" aria-label="What we offer">
            {OFFERS.map((o) => (
              <div className="av-card" role="listitem" key={o.title}>
                <i className={`fa-solid ${o.icon}`} aria-hidden="true"></i>
                <h4>{o.title}</h4>
                <p>{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline" aria-labelledby="timeline-title">
        <div className="section-tag">🕒 Our Journey</div>
        <h2 className="section-title" id="timeline-title">How we <span>got here</span></h2>
        <div className="timeline-track">
          {TIMELINE.map((t) => (
            <div className="timeline-item" key={t.year}>
              <div className="t-year">{t.year}</div>
              <h4>{t.title}</h4>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="values-grid" aria-labelledby="values-title">
        <div className="section-tag">⚙ What Drives Us</div>
        <h2 className="section-title" id="values-title">Our core <span>values</span></h2>
        <p className="section-sub">The principles behind every project and every mentorship session.</p>
        <div className="features-grid">
          {VALUES.map((v) => (
            <article className="card" key={v.title}>
              <div className={`card-icon ${v.color}`} aria-hidden="true"><i className={`fa-solid ${v.icon}`}></i></div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="team-title" style={{ padding: '5.5rem 6vw', background: 'var(--soft)' }}>
        <div className="section-tag">🤝 Meet the Team</div>
        <h2 className="section-title" id="team-title">The people behind <span>MainCrafts</span></h2>
        <p className="section-sub">A small, senior team of mentors and engineers guiding every cohort.</p>
        <div className="team-grid" role="list" aria-label="Team members">
          {TEAM.map((m) => (
            <div className="team-card" role="listitem" key={m.initials}>
              <div className="team-avatar" aria-hidden="true">{m.initials}</div>
              <h4>{m.name}</h4>
              <span>{m.role}</span>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
