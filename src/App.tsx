import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Sigma } from 'lucide-react'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import CurriculumPage from './pages/CurriculumPage'
import AboutPage from './pages/AboutPage'
import ReviewsPage from './pages/ReviewsPage'
import PricingPage from './pages/PricingPage'
import AdminDashboard from './pages/admindashboard'

import './index.css'

const ADMIN_USERNAMES = ['admin20.com', 'admin@20.com']
const ADMIN_PASSWORD = 'admin123'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-olive-alpha-20.vercel.app"

// ScrollToTop component to make sure page scroll resets on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AdminRedirect({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/admin', { replace: true })
    onDone()
  }, [navigate, onDone])

  return null
}

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [userName, setUserName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminRedirect, setAdminRedirect] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAuthOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab)
    setAuthError('')
    setAuthOpen(true)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const loginId = authForm.email.trim()

    if (authTab === 'login' && ADMIN_USERNAMES.includes(loginId.toLowerCase()) && authForm.password === ADMIN_PASSWORD) {
      setUserName('Admin')
      setIsAdmin(true)
      setAuthOpen(false)
      setAuthForm({ name: '', email: '', password: '' })
      setAdminRedirect(true)
      return
    }

    setAuthError('')
    setAuthLoading(true)

    try {
      const endpoint = authTab === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body = authTab === 'login'
        ? { identifier: loginId, password: authForm.password }
        : {
            username: authForm.name.trim(),
            email: loginId,
            password: authForm.password,
          }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.')
      }

      setUserName(data.user.username)
      setIsAdmin(false)
      setAuthOpen(false)
      setAuthForm({ name: '', email: '', password: '' })
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      {adminRedirect && <AdminRedirect onDone={() => setAdminRedirect(false)} />}
      
      <Navbar
        onLogin={() => openAuth('login')}
        onSignup={() => openAuth('signup')}
        userName={userName}
        isAdmin={isAdmin}
        onLogout={() => {
          setUserName(null)
          setIsAdmin(false)
        }}
      />

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />

      {/* Auth Modal */}
      {authOpen && (
        <div className="auth-overlay" id="auth-modal" onClick={(e) => { if (e.target === e.currentTarget) setAuthOpen(false) }}>
          <div className="auth-modal">
            {/* Close */}
            <button className="auth-close" id="auth-close-btn" onClick={() => setAuthOpen(false)} aria-label="Close">
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>×</span>
            </button>

            {/* Logo */}
            <div className="auth-logo">
              <div className="logo-badge"><Sigma size={16} strokeWidth={2} /></div>
              <span>IB<span style={{ color: 'var(--gold-dark)' }}>Math</span></span>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                id="auth-tab-login"
                className={`auth-tab${authTab === 'login' ? ' active' : ''}`}
                onClick={() => setAuthTab('login')}
              >Log In</button>
              <button
                id="auth-tab-signup"
                className={`auth-tab${authTab === 'signup' ? ' active' : ''}`}
                onClick={() => setAuthTab('signup')}
              >Sign Up</button>
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={handleAuth} id="auth-form">
              {authTab === 'signup' && (
                <div className="auth-field">
                  <label htmlFor="auth-name">Username</label>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="janesmith"
                    value={authForm.name}
                    onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="auth-email">{authTab === 'login' ? 'Username' : 'Email Address'}</label>
                <input
                  id="auth-email"
                  type={authTab === 'login' ? 'text' : 'email'}
                  placeholder={authTab === 'login' ? 'admin@20.com' : 'you@example.com'}
                  value={authForm.email}
                  onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  placeholder={authTab === 'signup' ? 'Min. 8 characters' : '••••••••'}
                  value={authForm.password}
                  onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>
              {authTab === 'login' && (
                <div className="auth-forgot"><a href="#" id="forgot-password">Forgot password?</a></div>
              )}
              {authError && (
                <div className="auth-error" role="alert">{authError}</div>
              )}
              <button type="submit" id="auth-submit-btn" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={authLoading}>
                {authLoading ? 'Please wait...' : authTab === 'login' ? 'Log In to My Account' : 'Create My Account'} →
              </button>
            </form>

            <p className="auth-switch">
              {authTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                id="auth-switch-btn"
                onClick={() => setAuthTab(authTab === 'login' ? 'signup' : 'login')}
              >{authTab === 'login' ? 'Sign Up' : 'Log In'}</button>
            </p>
          </div>
        </div>
      )}
    </BrowserRouter>
  )
}
