import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsApi } from '../api/client.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text }
  const [submitting, setSubmitting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const { name, email, message } = form;
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = true;
    if (!email.trim()) nextErrors.email = true;
    if (!message.trim()) nextErrors.message = true;

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('All fields are required!');
    }

    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = true;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Small delay so the "Saving…" state is perceptible, matching the original UX
      await new Promise((r) => setTimeout(r, 400));
      await contactsApi.create(form);

      setJustSaved(true);
      setStatus({
        type: 'success',
        text: '✓ Thanks! Your message has been saved. View it on the Submissions page.',
      });

      setTimeout(() => {
        setJustSaved(false);
        setStatus(null);
        setForm({ name: '', email: '', message: '' });
        setErrors({});
      }, 4000);
    } catch (err) {
      setStatus({ type: 'error', text: `✗ ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="main-content">
      <section className="page-header" aria-label="Contact page introduction">
        <div className="blob blob-1" aria-hidden="true"></div>
        <div className="blob blob-3" aria-hidden="true"></div>
        <span className="crumb"><i className="fa-solid fa-envelope" aria-hidden="true"></i> Get In Touch</span>
        <h1>Ready to <span>build</span> something great?</h1>
        <p>Fill in the form and our team will get back to you within 24 hours.</p>
      </section>

      <section className="contact-page" aria-labelledby="contact-title">
        <h2 className="section-title" id="contact-title" style={{ position: 'absolute', left: '-9999px' }}>Contact form</h2>
        <div className="contact-grid">

          <div className="contact-form-col">
            <form className="contact-form" name="contactForm" noValidate aria-label="Contact form" onSubmit={handleSubmit}>
              <div className={`form-group${errors.name ? ' error' : ''}`} id="name-group">
                <label htmlFor="name">Name <span className="req">*</span></label>
                <input
                  type="text" id="name" name="name" placeholder="Enter your name"
                  autoComplete="name" required value={form.name} onChange={handleChange}
                />
                <span className="field-error">Please enter your name.</span>
              </div>
              <div className={`form-group${errors.email ? ' error' : ''}`} id="email-group">
                <label htmlFor="email">Email <span className="req">*</span></label>
                <input
                  type="email" id="email" name="email" placeholder="Enter your email"
                  autoComplete="email" required value={form.email} onChange={handleChange}
                />
                <span className="field-error">Please enter a valid email address.</span>
              </div>
              <div className={`form-group${errors.message ? ' error' : ''}`} id="message-group">
                <label htmlFor="message">Message <span className="req">*</span></label>
                <textarea
                  id="message" name="message" placeholder="Enter message"
                  required value={form.message} onChange={handleChange}
                ></textarea>
                <span className="field-error">Please enter a message.</span>
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? (
                  'Saving…'
                ) : justSaved ? (
                  <><i className="fa-solid fa-check" aria-hidden="true"></i>&nbsp; Saved!</>
                ) : (
                  <><i className="fa-solid fa-paper-plane" aria-hidden="true"></i>&nbsp; Send Message</>
                )}
              </button>
              {status && (
                <p
                  id="form-status"
                  role="status"
                  aria-live="polite"
                  className={status.type === 'success' ? 'status-success' : 'status-error'}
                  style={{ fontSize: '.9rem', display: 'block' }}
                >
                  {status.text}
                </p>
              )}
            </form>
          </div>

          <div className="contact-info-col" aria-label="Contact information">
            <div className="info-card">
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              <div>
                <h4>Email</h4>
                <p><a href="mailto:hr@maincrafts.com">hr@maincrafts.com</a></p>
              </div>
            </div>
            <div className="info-card">
              <i className="fa-solid fa-globe" aria-hidden="true"></i>
              <div>
                <h4>Website</h4>
                <p><a href="https://www.maincrafts.com">www.maincrafts.com</a></p>
              </div>
            </div>
            <div className="info-card">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
              <div>
                <h4>Response Time</h4>
                <p>Within 24 hours, Monday–Friday.</p>
              </div>
            </div>
            <div className="info-card">
              <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
              <div>
                <h4>Before you send</h4>
                <p>Name, email, and message are all required — we'll flag anything missing before saving.</p>
              </div>
            </div>
            <div className="info-card">
              <i className="fa-solid fa-inbox" aria-hidden="true"></i>
              <div>
                <h4>Where does this go?</h4>
                <p>Submissions are saved to the MongoDB database via our API and listed on the <Link to="/submissions">Submissions page</Link>.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
