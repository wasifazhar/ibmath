import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { plans } from '../data'

export default function PricingPage() {
  const [email, setEmail] = useState('')
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert(`Thank you! We'll be in touch at ${email} within 24 hours.`)
      setEmail('')
    }
  }

  return (
    <>
      <PageHeader
        tag="✦ Lesson Pricing"
        title="$12 / 50-Minute Lesson"
        accent="$12"
        subtitle="Simple, transparent hourly rates. No lock-in contracts. Start with a free trial session to see if it's a fit."
      />

      <section className="section" id="pricing">
        <div className="section-inner">
          <div className="pricing-grid">
            {plans.map((p, i) => (
              <div className={`pricing-card${p.featured ? ' featured' : ''}`} id={`pricing-card-${i}`} key={i}>
                {p.featured && <div className="pricing-badge">Most Popular</div>}
                <div className="pricing-plan">{p.plan}</div>
                <div className="pricing-price">
                  <sup>$</sup>{p.price}<sub>/ lesson</sub>
                </div>
                <div className="pricing-desc">{p.desc}</div>
                <div className="pricing-features">
                  {p.features.map((f, j) => (
                    <div className="pricing-feature" key={j}>
                      <span className="check">✓</span> {f}
                    </div>
                  ))}
                </div>
                <a
                  href="#contact-form-section"
                  id={`pricing-cta-${i}`}
                  className={`btn ${p.featured ? 'btn-gold' : 'btn-primary'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="cta-section" id="contact-form-section">
        <div className="cta-card">
          <div className="section-tag gold" style={{ marginBottom: 20 }}>✦ Book a Free Trial</div>
          <h2>Start Your Math Journey Today</h2>
          <p>Embark on your mathematics journey with a complimentary trial lesson. Together we will work towards your academic and career goals — making maths fun and easier. Let's get started!</p>
          <form className="cta-form" onSubmit={handleBooking} id="booking-form">
            <input
              id="email-input"
              type="email"
              className="cta-input"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" id="book-now-btn" className="btn btn-gold">
              Book Free Trial →
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
