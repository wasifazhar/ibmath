import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sigma, BookOpen, X, Menu, UserCircle, LogOut } from 'lucide-react'

interface Props {
  onLogin: () => void
  onSignup: () => void
  userName: string | null
  isAdmin: boolean
  onLogout: () => void
}

const links = [
  { to: '/services',   label: 'Services' },
  { to: '/curriculum', label: 'Curriculum' },
  { to: '/about',      label: 'About' },
  { to: '/reviews',    label: 'Reviews' },
  { to: '/pricing',    label: 'Pricing' },
]

export default function Navbar({ onLogin, onSignup, userName, isAdmin, onLogout }: Props) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const handleLogout = () => {
    const shouldReturnHome = isAdmin && pathname === '/admin'
    onLogout()
    setProfileOpen(false)
    setMenuOpen(false)
    if (shouldReturnHome) {
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      <style>{`
        .announce-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 16px;
          background: var(--navy-dark, #0a1628);
          font-size: 0.8rem;
          text-align: center;
          flex-wrap: wrap;
        }
        .announce-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--gold-light, #f0c040);
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: .4; }
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #fff;
          border-bottom: 1px solid rgba(0,0,0,.08);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 24px;
          height: 64px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-badge {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: var(--navy, #0f2044);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold-light, #f0c040);
        }
        .logo-text {
          font-size: 1rem;
          font-weight: 800;
          color: var(--navy, #0f2044);
          line-height: 1.1;
          display: flex;
          flex-direction: column;
        }
        .logo-text span:first-child { color: var(--gold-light, #f0c040); }
        .logo-tagline {
          font-size: 0.65rem;
          font-weight: 500;
          color: rgba(0,0,0,.45);
          letter-spacing: .03em;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 16px;
        }
        .navbar-links a {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary, #555);
          text-decoration: none;
          transition: background .15s, color .15s;
        }
        .navbar-links a:hover { background: rgba(0,0,0,.05); color: var(--navy, #0f2044); }

        .nav-divider { flex: 1; }

        .navbar-cta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .profile-menu-wrap {
          position: relative;
        }
        .profile-icon-btn {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(15,32,68,.12);
          border-radius: 12px;
          background: #fff;
          color: var(--navy, #0f2044);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background .15s, border-color .15s, box-shadow .15s;
        }
        .profile-icon-btn:hover,
        .profile-icon-btn:focus-visible {
          background: rgba(15,32,68,.05);
          border-color: rgba(15,32,68,.2);
          box-shadow: 0 4px 14px rgba(15,32,68,.08);
          outline: none;
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 220px;
          padding: 12px;
          border: 1px solid rgba(15,32,68,.10);
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 16px 42px rgba(15,32,68,.16);
          z-index: 150;
        }
        .profile-name {
          padding: 8px 8px 12px;
          border-bottom: 1px solid rgba(15,32,68,.08);
          color: var(--navy, #0f2044);
          font-size: .9rem;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .profile-logout-btn {
          width: 100%;
          margin-top: 8px;
          padding: 10px 8px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #b42318;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: .9rem;
        }
        .profile-logout-btn:hover {
          background: #fff1f0;
        }
        .profile-dashboard-link {
          width: 100%;
          margin-top: 8px;
          padding: 10px 8px;
          border-radius: 10px;
          color: var(--navy, #0f2044);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: .9rem;
          text-decoration: none;
        }
        .profile-dashboard-link:hover {
          background: rgba(15,32,68,.06);
        }

        /* ── Hamburger — always rendered, hidden on desktop ── */
        .nav-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border: 1px solid rgba(0,0,0,.1);
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          color: var(--navy, #0f2044);
          margin-left: auto;
          flex-shrink: 0;
          transition: background .15s, border-color .15s;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-hamburger:hover,
        .nav-hamburger:focus-visible {
          background: rgba(0,0,0,.04);
          border-color: rgba(0,0,0,.18);
          outline: none;
        }
        .nav-hamburger svg {
          display: block;
          pointer-events: none;
        }

        /* ── Overlay ── */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity .25s;
        }
        .mobile-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── Drawer ── */
        .mobile-drawer {
          position: fixed;
          top: 0; right: 0;
          width: min(320px, 88vw);
          height: 100dvh;
          background: #fff;
          z-index: 201;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform .28s cubic-bezier(.4,0,.2,1);
          box-shadow: -8px 0 32px rgba(0,0,0,.12);
        }
        .mobile-drawer.open { transform: translateX(0); }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0,0,0,.07);
          flex-shrink: 0;
        }
        .drawer-close {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: none; background: rgba(0,0,0,.05);
          border-radius: 8px; cursor: pointer;
          color: var(--navy, #0f2044);
          -webkit-tap-highlight-color: transparent;
        }
        .drawer-close:hover { background: rgba(0,0,0,.1); }

        .drawer-links {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .drawer-links a {
          display: flex;
          align-items: center;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          color: var(--navy, #0f2044);
          text-decoration: none;
          transition: background .15s;
          -webkit-tap-highlight-color: transparent;
        }
        .drawer-links a:hover,
        .drawer-links a.active {
          background: rgba(15,32,68,.06);
          font-weight: 700;
        }

        .drawer-footer {
          padding: 16px 20px calc(24px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid rgba(0,0,0,.07);
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .drawer-footer .btn-gold {
          width: 100%;
          justify-content: center;
          padding: 14px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .drawer-login-btn {
          width: 100%;
          padding: 12px;
          font-size: 0.9rem;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.12);
          background: transparent;
          color: var(--navy, #0f2044);
          font-weight: 600;
          cursor: pointer;
          transition: background .15s;
          -webkit-tap-highlight-color: transparent;
        }
        .drawer-login-btn:hover { background: rgba(0,0,0,.04); }
        .drawer-signup-btn {
          width: 100%;
          justify-content: center;
        }
        .drawer-profile {
          padding: 14px;
          border: 1px solid rgba(15,32,68,.10);
          border-radius: 14px;
          background: rgba(15,32,68,.04);
        }
        .drawer-profile-name {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color: var(--navy, #0f2044);
          font-weight: 800;
          overflow: hidden;
        }
        .drawer-profile-name span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── Sticky bottom bar ── */
        .mobile-bottom-bar {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 99;
          background: #fff;
          border-top: 1px solid rgba(0,0,0,.1);
          padding: 10px 16px env(safe-area-inset-bottom, 16px);
        }
        .mobile-bottom-bar .btn-gold {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 14px;
          font-size: 0.9rem;
        }

        /* ── Breakpoint ── */
        @media (max-width: 768px) {
          .navbar-links,
          .navbar-cta,
          .nav-divider { display: none !important; }

          .nav-hamburger { display: flex; }

          .mobile-overlay { display: block; }
          .mobile-drawer  { display: flex; }

          .mobile-bottom-bar { display: block; }

          body { padding-bottom: 80px; }
        }
      `}</style>

      {/* Main Navbar */}
      <nav className="navbar scrolled">
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo" id="nav-logo">
            <div className="logo-badge"><Sigma size={18} strokeWidth={2} /></div>
            <div className="logo-text">
              IB<span>Math</span>
              <span className="logo-tagline">Expert Tutoring</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="navbar-links">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                id={`nav-${l.label.toLowerCase()}`}
                style={{
                  color:      pathname === l.to ? 'var(--navy)' : undefined,
                  fontWeight: pathname === l.to ? 700 : undefined,
                  background: pathname === l.to ? 'rgba(15,32,68,.07)' : undefined,
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-divider" />

          {/* Desktop CTA — Login + Book */}
          <div className="navbar-cta">
            {userName ? (
              <div className="profile-menu-wrap" ref={profileRef}>
                <button
                  id="nav-profile"
                  className="profile-icon-btn"
                  onClick={() => setProfileOpen(open => !open)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  type="button"
                >
                  <UserCircle size={24} strokeWidth={1.8} />
                </button>
                {profileOpen && (
                  <div className="profile-dropdown" role="menu">
                    <div className="profile-name">{userName}</div>
                    {isAdmin && (
                      <Link className="profile-dashboard-link" to="/admin" role="menuitem">
                        Dashboard
                      </Link>
                    )}
                    <button className="profile-logout-btn" onClick={handleLogout} type="button" role="menuitem">
                      <LogOut size={16} strokeWidth={2} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button id="nav-login" className="btn btn-ghost" onClick={onLogin}>
                Log In
              </button>
            )}
            <Link to="/pricing" id="nav-cta" className="btn btn-gold nav-book-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={15} strokeWidth={2} />
              Book Free Trial
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            type="button"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`mobile-drawer ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="drawer-header">
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <div className="logo-badge"><Sigma size={16} strokeWidth={2} /></div>
            <div className="logo-text">
              IB<span>Math</span>
              <span className="logo-tagline">Expert Tutoring</span>
            </div>
          </Link>
          <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu" type="button">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-links">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={pathname === l.to ? 'active' : ''}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="drawer-footer">
          <Link
            to="/pricing"
            className="btn btn-gold"
            onClick={() => setMenuOpen(false)}
          >
            <BookOpen size={15} strokeWidth={2} />
            Book Free Trial
          </Link>
          {userName ? (
            <div className="drawer-profile">
              <div className="drawer-profile-name">
                <UserCircle size={20} strokeWidth={1.8} />
                <span>{userName}</span>
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="btn btn-primary drawer-signup-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <button
                className="drawer-login-btn"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="btn btn-primary drawer-signup-btn"
                onClick={() => { onSignup(); setMenuOpen(false) }}
                type="button"
              >
                Sign Up
              </button>
              <button
                className="drawer-login-btn"
                onClick={() => { onLogin(); setMenuOpen(false) }}
                type="button"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="mobile-bottom-bar">
        <Link to="/pricing" className="btn btn-gold">
          <BookOpen size={15} strokeWidth={2} />
          Book Free Trial
        </Link>
      </div>
    </>
  )
}
