import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { testimonials } from '../data'

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        tag="✦ What Students Say"
        title="4.9 ★ from 140 Verified Reviews"
        accent="4.9 ★"
        subtitle="Read real stories of grade improvements, boosted confidence, and exam success from students around the world."
      />

      <section className="section testimonials-section" id="testimonials">
        <div className="section-inner">
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card animate-in" id={`testimonial-${i}`} key={i}>
                <div className="testimonial-stars" style={{ color: 'var(--gold)', marginBottom: 16 }}>
                  {'★'.repeat(t.stars)}
                </div>
                <div className="testimonial-quote" style={{ fontSize: '2.5rem', color: 'var(--gold-light)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                  "
                </div>
                <p className="testimonial-text" style={{ color: 'var(--text-secondary)', fontSize: '.95rem', lineHeight: 1.7, marginBottom: 24 }}>
                  {t.text}
                </p>
                <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="author-avatar" style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--navy-light), var(--blue-light))',
                    display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--navy)'
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="author-name" style={{ fontWeight: 600, fontSize: '.9rem' }}>{t.name}</div>
                    <div className="author-meta" style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: 'var(--surface)', padding: '64px 24px', textAlign: 'center', borderTop: '1px solid var(--border-soft)' }}>
        <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>Ready to achieve your target grade?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Join our successful students today. Try your first session free.</p>
        <Link to="/pricing" className="btn btn-gold btn-lg">Book Free Trial Session →</Link>
      </div>
    </>
  )
}
