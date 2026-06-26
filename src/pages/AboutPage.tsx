import PageHeader from '../components/PageHeader'
import { whyFeatures, whyStats } from '../data'

export default function AboutPage() {
  return (
    <>
      <PageHeader
        tag="✦ About Ather"
        title="20 Years of Excellence in Mathematics Teaching"
        accent="Excellence in Mathematics"
        subtitle="Ather taught 6,000+ lessons globally."
      />

      <section className="section why-section" id="why" style={{ background: 'var(--navy-mid)' }}>
        <div className="section-inner">
          <div className="why-grid">
            <div className="why-content">
              <div className="section-tag gold" style={{ display: 'inline-block', marginBottom: 12 }}>✦ Credentials &amp; Philosophy</div>
              <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: 20 }}>Guiding Students to Academic Success</h2>
              <p style={{ color: 'rgba(255,255,255,.72)', marginBottom: 36, lineHeight: 1.7 }}>
                Teaching mathematics is not just about solving equations; it's about building confidence and developing critical thinking. Over the last 16 years, Sir Ather has helped hundreds of students from 40+ countries understand complex mathematical structures.
              </p>
              <div className="why-features">
                {whyFeatures.map((f, i) => (
                  <div className="why-feature" id={`why-feature-${i}`} key={i}>
                    <div className="why-feature-icon">
                      <f.Icon size={20} strokeWidth={1.6} style={{ color: 'var(--gold-light)' }} />
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', marginBottom: 4 }}>{f.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', margin: 0 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-visual">
              {whyStats.map((s, i) => (
                <div className="why-stat-card" id={`why-stat-${i}`} key={i}>
                  <div className="num" style={{ color: 'var(--gold-light)', fontSize: '2.4rem', fontWeight: 800 }}>{s.num}</div>
                  <div className="lbl" style={{ color: 'rgba(255,255,255,.6)', marginTop: 6 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <div style={{ background: 'var(--surface-2)', padding: '64px 24px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Unlock Your Mathematical Potential</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Whether preparing for IB HL AA, GCSE exams, or looking to catch up on fundamentals, Ather creates a supportive environment that turns anxiety into understanding.
        </p>
        <a href="/pricing" className="btn btn-gold btn-lg">Book a Trial with Ather</a>
      </div>
    </>
  )
}
