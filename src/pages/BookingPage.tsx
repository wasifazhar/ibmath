import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import {
  formatHourLabel,
  formatSlotLabel,
  getAvailableStartSlots,
  getLockedSlots,
  getSlotCount,
  isPaidPlan,
} from '../utils/timeSlots'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-olive-alpha-20.vercel.app"

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function BookingPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    preferredDate: '',
    preferredTime: '',
    subject: 'IB Mathematics AA SL',
    pricingPlan: "Unsure / Let's Discuss",
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    const stateEmail = location.state?.email
    const params = new URLSearchParams(location.search)
    const paramEmail = params.get('email')
    const paramPlan = params.get('plan')

    setFormData(prev => ({
      ...prev,
      email: stateEmail || paramEmail || prev.email,
      pricingPlan: paramPlan || prev.pricingPlan
    }))
  }, [location])

  useEffect(() => {
    if (!formData.preferredDate) {
      setAvailableSlots([])
      return
    }

    let cancelled = false
    setLoadingSlots(true)

    async function fetchAvailability() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/bookings/availability?date=${encodeURIComponent(formData.preferredDate)}&plan=${encodeURIComponent(formData.pricingPlan)}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load available time slots.')
        }

        if (!cancelled) {
          setAvailableSlots(data.availableSlots || [])
        }
      } catch {
        try {
          const fallback = await fetch(`${API_BASE_URL}/api/bookings`)
          const fallbackData = await fallback.json()
          if (!cancelled && fallback.ok) {
            const allBookings = fallbackData.bookings || []
            setAvailableSlots(
              getAvailableStartSlots(allBookings, formData.preferredDate, formData.pricingPlan)
            )
          }
        } catch {
          if (!cancelled) {
            setAvailableSlots([])
          }
        }
      } finally {
        if (!cancelled) setLoadingSlots(false)
      }
    }

    fetchAvailability()
  }, [formData.preferredDate, formData.pricingPlan])

  useEffect(() => {
    if (formData.preferredTime && !availableSlots.includes(formData.preferredTime)) {
      setFormData(prev => ({ ...prev, preferredTime: '' }))
    }
  }, [formData.preferredTime, availableSlots])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSlotSelect = (time: string) => {
    setFormData(prev => ({ ...prev, preferredTime: time }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.preferredTime) {
      setError('Please select an available time slot.')
      setLoading(false)
      return
    }

    try {
      const availabilityResponse = await fetch(
        `${API_BASE_URL}/api/bookings/availability?date=${encodeURIComponent(formData.preferredDate)}&plan=${encodeURIComponent(formData.pricingPlan)}`
      )
      const availabilityData = await availabilityResponse.json()

      if (!availabilityResponse.ok) {
        throw new Error(availabilityData.message || 'Could not verify availability. Please try again.')
      }

      if (!(availabilityData.availableSlots || []).includes(formData.preferredTime)) {
        throw new Error('This time slot is no longer available. Please choose another.')
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const slotCount = getSlotCount(formData.pricingPlan)
  const selectedSlots = formData.preferredTime
    ? getLockedSlots(formData.preferredTime, slotCount)
    : []

  return (
    <>
      <PageHeader
        tag="✦ Get Started"
        title="Book Your Free Consultation"
        accent="Consultation"
        subtitle="Schedule a free trial lesson to discuss your goals and how we can help you achieve them."
      />

      <section className="section" style={{ maxWidth: 800, margin: '0 auto', paddingTop: 40, paddingBottom: 80 }}>
        {success ? (
          <div className="cta-card" style={{ textAlign: 'center' }}>
            <div className="section-tag gold" style={{ marginBottom: 20 }}>✦ Booking Confirmed</div>
            <h2>Thank You!</h2>
            <p>Your free consultation has been booked. We will be in touch shortly to confirm the details.</p>
            <p>Redirecting to home...</p>
          </div>
        ) : (
          <div className="cta-card" style={{ textAlign: 'left' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="cta-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="cta-input"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>Selected Plan *</label>
                <select
                  name="pricingPlan"
                  className="cta-input"
                  value={formData.pricingPlan}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', appearance: 'auto', backgroundColor: '#fff', color: '#111' }}
                >
                  <option value="Trial">Trial (Free — 30 min)</option>
                  <option value="Regular">Regular ($15/lesson — 1 hour)</option>
                  <option value="Intensive">Intensive ($24/lesson — 1 hour)</option>
                  <option value="Unsure / Let's Discuss">Unsure / Let's Discuss (30 min)</option>
                </select>
                <p style={{ marginTop: 8, fontSize: 14, color: '#94a3b8' }}>
                  {isPaidPlan(formData.pricingPlan)
                    ? 'Paid lessons lock 2 consecutive half-hour slots (1 hour total).'
                    : 'Free trial locks 1 half-hour slot.'}
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  className="cta-input"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={todayDateString()}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>
                  Available Time Slots *
                </label>
                {!formData.preferredDate ? (
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>Select a date to see available times.</p>
                ) : loadingSlots ? (
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading available slots...</p>
                ) : availableSlots.length === 0 ? (
                  <p style={{ color: '#f87171', fontSize: 14 }}>No available slots on this date. Please choose another date.</p>
                ) : (
                  <div className="time-slot-grid">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const slots = [`${String(hour).padStart(2, '0')}:00`, `${String(hour).padStart(2, '0')}:30`]
                      return (
                        <div key={hour} className="time-slot-hour">
                          <div className="time-slot-hour-label">{formatHourLabel(hour)}</div>
                          <div className="time-slot-buttons">
                            {slots.map((slot) => {
                              const isAvailable = availableSlots.includes(slot)
                              const isSelected = formData.preferredTime === slot
                              const isPartOfSelection = selectedSlots.includes(slot) && isSelected

                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={!isAvailable}
                                  className={`time-slot-btn${isSelected ? ' selected' : ''}${!isAvailable ? ' unavailable' : ''}`}
                                  onClick={() => handleSlotSelect(slot)}
                                  title={
                                    isAvailable
                                      ? isPaidPlan(formData.pricingPlan)
                                        ? `Books ${formatSlotLabel(slot)} – ${formatSlotLabel(getLockedSlots(slot, 2)[1] || slot)}`
                                        : `Books ${formatSlotLabel(slot)} (30 min)`
                                      : 'Already booked'
                                  }
                                >
                                  {formatSlotLabel(slot)}
                                  {isPartOfSelection && isPaidPlan(formData.pricingPlan) && (
                                    <span className="time-slot-duration">1 hr</span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                {formData.preferredTime && (
                  <p style={{ marginTop: 12, fontSize: 14, color: '#c9a84c' }}>
                    Selected: {selectedSlots.map(formatSlotLabel).join(' – ')}
                    {!isPaidPlan(formData.pricingPlan) && ' (30 min)'}
                    {isPaidPlan(formData.pricingPlan) && ' (1 hour)'}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>Subject / Topic *</label>
                <select
                  name="subject"
                  className="cta-input"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', appearance: 'auto', backgroundColor: '#fff', color: '#111' }}
                >
                  <option value="IB Mathematics AA SL">IB Mathematics AA SL</option>
                  <option value="IB Mathematics AA HL">IB Mathematics AA HL</option>
                  <option value="IB Mathematics AI SL">IB Mathematics AI SL</option>
                  <option value="IB Mathematics AI HL">IB Mathematics AI HL</option>
                  <option value="AP Calculus">AP Calculus</option>
                  <option value="SAT Math">SAT Math</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>Describe what you need help with *</label>
                <textarea
                  name="description"
                  className="cta-input"
                  placeholder="I need help with integration and exam preparation..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {error && <div style={{ color: 'red', fontWeight: 500 }}>{error}</div>}

              <button type="submit" className="btn btn-gold" style={{ justifyContent: 'center', marginTop: 10 }} disabled={loading || !formData.preferredTime}>
                {loading ? 'Booking...' : 'Book Consultation'}
              </button>
            </form>
          </div>
        )}
      </section>
    </>
  )
}
