import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { services } from '../data'

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        tag="✦ What Ather Teaches"
        title="Expert Tuition Across Every Major Syllabus"
        accent="Every Major Syllabus"
        subtitle="From IB and GCSE to AP Calculus and SAT — 16 years of proven teaching experience across every major mathematics curriculum."
      />

      <section className="section" id="services">
        <div className="section-inner">
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card animate-in" id={`service-card-${i}`} key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="service-icon"><s.Icon size={26} strokeWidth={1.6} style={{ color: 'var(--navy)' }} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-tag">{s.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <div style={{ background: 'var(--surface-2)', padding: '48px 24px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>Not sure which course you need?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Book a free 50-min trial and Ather will assess your level and build a personalised plan.</p>
        <Link to="/pricing" className="btn btn-gold btn-lg">Book a Free Trial →</Link>
      </div>
    </>
  )
}
