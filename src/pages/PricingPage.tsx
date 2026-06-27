import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { plans } from '../data'

export default function PricingPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      navigate(`/book?email=${encodeURIComponent(email)}`)
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
                <button
                  id={`pricing-cta-${i}`}
                  className={`btn ${p.featured ? 'btn-gold' : 'btn-primary'}`}
                  style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                  onClick={() => navigate(`/book?plan=${encodeURIComponent(p.plan)}&price=${encodeURIComponent(p.price)}`)}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
