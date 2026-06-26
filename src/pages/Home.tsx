import { Link } from 'react-router-dom'
import { Star, Trophy, GraduationCap, Clock, TrendingUp, Users, Ruler, BookOpen, CreditCard } from 'lucide-react'
import tutorPhoto from '../assets/tutor.jpg'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-inner">

          {/* Left: Text */}
          <div className="hero-content">
            <div className="hero-badge" id="hero-badge">
              <Star size={13} strokeWidth={2.5} style={{ color: 'var(--gold-dark)' }} />
              <span>Rated <strong>4.9 ★</strong> from 140 real student reviews</span>
            </div>

            <h1 className="hero-title">
              Master <span className="hero-accent">Mathematics</span>{' '}
              with Ather Amin.
            </h1>

            <p className="hero-sub">
              Certified tutor with <strong>20 years</strong> of experience. Master's in Mathematics.
              IB SL/HL · GCSE · IGCSE · A-Level · AP Calculus · SAT · O-Level.
              Taught <strong>4,150+ lessons</strong> to students from <strong>40+ countries</strong>.
            </p>

            {/* Trust row */}
            <div className="hero-trust">
              <div className="trust-item">
                <Trophy size={15} strokeWidth={2} />
                <span>20 years experience</span>
              </div>
              <div className="trust-sep" />
              <div className="trust-item">
                <GraduationCap size={15} strokeWidth={2} />
                <span>Master's in Mathematics</span>
              </div>
              <div className="trust-sep" />
              <div className="trust-item">
                <Star size={15} strokeWidth={2} />
                <span>4.9 ★ · 140 reviews</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/pricing" id="hero-cta-primary" className="btn btn-gold btn-lg">
                Book a Free Trial Session
                <TrendingUp size={16} strokeWidth={2} />
              </Link>
              <Link to="/services" id="hero-cta-secondary" className="btn btn-outline btn-lg">
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right: Tutor card */}
          <div className="hero-visual" style={{ width: '100%', maxWidth: 400 }}>
            <div className="tutor-card" id="tutor-card">
              <div className="tutor-photo-wrap">
                <img src={tutorPhoto} alt="Ather A. — IB Math Tutor" className="tutor-photo" id="tutor-photo" />
              </div>
              <div className="tutor-info">
                <div className="tutor-name">Ather A.</div>
                <div className="tutor-title">IB Math Tutor · AA &amp; AI, HL &amp; SL</div>
                <ul className="tutor-bullets">
                  <li><span className="tutor-dot" /><strong>4.9 ★</strong> rating · 140 reviews</li>
                  <li><span className="tutor-dot" /><strong>4,150+</strong> lessons taught</li>
                  <li><span className="tutor-dot" /><strong>70%</strong> of students achieve Grade 6 or 7</li>
                  <li><span className="tutor-dot" />Students from <strong>40+</strong> countries</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {[
            { Icon: Users, num: '4,150+', lbl: 'Lessons Taught' },
            { Icon: TrendingUp, num: '70%', lbl: 'Achieve Grade 6 or 7' },
            { Icon: Clock, num: '20 Yrs', lbl: 'Teaching Experience' },
            { Icon: Star, num: '4.9 ★', lbl: '140 Student Reviews' },
          ].map((s, i) => (
            <div className="stat-item" key={i} id={`stat-${i}`}>
              <s.Icon size={20} strokeWidth={1.8} style={{ color: 'var(--gold-dark)', marginBottom: 4 }} />
              <div className="stat-num stat-gold">{s.num}</div>
              <div className="stat-label">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav cards */}
      <section className="section" style={{ paddingTop: 48, paddingBottom: 48, paddingLeft: 16, paddingRight: 16 }}>
        <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: 32, textAlign: 'center' }}>
            <div className="section-tag" style={{ marginBottom: 8 }}>✦ Explore</div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: 12 }}>Everything You Need to Succeed</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>Navigate to any section to learn more about how Ather can help you reach your target grade.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { to: '/services', Icon: Ruler, label: 'Services', desc: 'All subjects covered' },
              { to: '/curriculum', Icon: BookOpen, label: 'Curriculum', desc: 'Every syllabus' },
              { to: '/about', Icon: GraduationCap, label: 'About', desc: 'Ather\'s background' },
              { to: '/reviews', Icon: Star, label: 'Reviews', desc: '140 student reviews' },
              { to: '/pricing', Icon: CreditCard, label: 'Pricing', desc: '$12 / 50-min lesson' },
            ].map((card) => (
              <Link
                key={card.to}
                to={card.to}
                style={{ textDecoration: 'none' }}
              >
                <div className="service-card" style={{ padding: '28px 24px', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
                  <div className="service-icon" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', marginBottom: 16, background: 'var(--navy-light)' }}>
                    <card.Icon size={20} strokeWidth={1.8} style={{ color: 'var(--navy)' }} />
                  </div>
                  <h3 style={{ marginBottom: 8, fontSize: '1.1rem' }}>{card.label}</h3>
                  <p style={{ fontSize: '.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
