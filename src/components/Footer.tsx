import { Link } from 'react-router-dom'
import { Sigma, Mail, MessageSquare, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-badge"><Sigma size={16} strokeWidth={2} /></div>
              IB<span style={{ color: 'var(--gold-light)' }}>Math</span>
            </div>
            <p>Expert IB Mathematics tutoring for students who are serious about achieving their best possible grade.</p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services" id="footer-link-ib">IB AA & AI SL/HL</Link></li>
              <li><Link to="/services" id="footer-link-gcse">GCSE & IGCSE</Link></li>
              <li><Link to="/services" id="footer-link-ap">AP Calculus & SAT</Link></li>
              <li><Link to="/services" id="footer-link-alevel">A-Level & O-Level</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/curriculum" id="footer-link-curriculum">Curriculum</Link></li>
              <li><Link to="/pricing"    id="footer-link-pricing">Pricing</Link></li>
              <li><Link to="/reviews"    id="footer-link-testimonials">Reviews</Link></li>
              <li><Link to="/pricing"    id="footer-link-contact">Book a Session</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:info@ibmath.org" id="footer-email" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} />info@ibmath.org
                </a>
              </li>
              <li>
                <a href="https://wa.me/923214286142" id="footer-whatsapp" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={14} />WhatsApp
                </a>
              </li>
              <li>
                <a href="#" id="footer-timezone" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={14} />Online — Worldwide
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 <span>IBMath Tutor</span>. All rights reserved.</div>
          <div>Crafted for IB students who demand excellence.</div>
        </div>
      </div>
    </footer>
  )
}
