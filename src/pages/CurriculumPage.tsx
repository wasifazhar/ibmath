import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { curriculum } from '../data'

export default function CurriculumPage() {
  return (
    <>
      <PageHeader
        tag="✦ Courses Covered"
        title="Comprehensive IB & AP / SAT Courses"
        accent="IB & AP / SAT Courses"
        subtitle="IB Mathematics (AA & AI), AP Calculus, and SAT Math — comprehensively taught with 20 years of hands-on experience."
      />

      <section className="section" id="curriculum">
        <div className="section-inner">
          <div className="curriculum-grid">
            {curriculum.map((c, i) => (
              <div className="curriculum-card animate-in" id={`curriculum-card-${i}`} key={i}>
                <div className="curriculum-level">{c.level}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="curriculum-topics">
                  {c.topics.map((t, j) => (
                    <span className="topic-chip" key={j}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: 'var(--surface-2)', padding: '48px 24px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>Your syllabus. Your pace. Your goals.</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Every lesson is tailored to your specific board and exam timeline.</p>
        <Link to="/pricing" className="btn btn-gold btn-lg">Start with a Free Trial →</Link>
      </div>
    </>
  )
}
