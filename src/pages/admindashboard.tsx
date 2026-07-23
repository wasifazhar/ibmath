import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCheck, DollarSign, GraduationCap, MessageSquare, Users } from 'lucide-react'
import { curriculum, plans } from '../data'
import { useNavigate } from 'react-router-dom'

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_REACT_APP_BASE_URL || "https://backend-olive-alpha-20.vercel.app"
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '')

interface RegisteredUser {
  id: string
  username: string
  email: string
  createdAt?: string
}

interface Booking {
  _id: string
  fullName: string
  email: string
  preferredDate: string
  preferredTime: string
  subject: string
  pricingPlan?: string
  description: string
  status: string
  paymentStatus?: string
  createdAt?: string
}



const PLAN_PRICES = Object.fromEntries(
  plans.map((plan) => [plan.plan, Number(plan.price)])
) as Record<string, number>

const STATS_REFRESH_MS = 30_000

function isTrialRequest(booking: Booking): boolean {
  const plan = booking.pricingPlan || ''
  return plan === 'Trial' || plan.includes('Unsure') || !plan
}

function isPaidRequest(booking: Booking): boolean {
  const plan = booking.pricingPlan || ''
  return plan === 'Regular' || plan === 'Intensive'
}

function getPaymentStatus(booking: Booking): string {
  if (booking.paymentStatus) return booking.paymentStatus
  if (isTrialRequest(booking)) return 'Free'
  return '🟡 Pending'
}

function getBookingStatus(booking: Booking): string {
  const status = booking.status || ''
  if (status.includes('Confirmed') || status.includes('Accepted')) return '🟢 Confirmed'
  if (status.includes('Cancelled') || status.includes('Rejected')) return '🔴 Cancelled'
  if (status.includes('Failed')) return '🔴 Failed'
  return '🟡 Pending'
}

function isTrialPending(booking: Booking): boolean {
  const status = booking.status || ''
  return !status.includes('Accepted') && !status.includes('Confirmed') && !status.includes('Rejected') && !status.includes('Cancelled')
}

function isPaidPending(booking: Booking): boolean {
  const payment = getPaymentStatus(booking)
  const bookingStatus = getBookingStatus(booking)
  return payment.includes('Pending') || bookingStatus.includes('Pending')
}

function getPlanPrice(pricingPlan?: string): number {
  const plan = (pricingPlan || '').trim()
  return PLAN_PRICES[plan] ?? 0
}

function isRevenueBooking(booking: Booking): boolean {
  if (!isPaidRequest(booking)) return false
  const payment = getPaymentStatus(booking)
  if (payment.includes('Paid')) return true
  const status = booking.status || ''
  return status.includes('Confirmed') || status.includes('Accepted')
}

function isInCurrentMonth(dateStr?: string): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return false
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [usersError, setUsersError] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsError, setBookingsError] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [reviewPopoverOpen, setReviewPopoverOpen] = useState(false)
  const reviewButtonRef = useRef<HTMLDivElement>(null)
  const [resourceModalOpen, setResourceModalOpen] = useState(false)
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', subject: '' })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const trialBookings = bookings.filter(isTrialRequest)
  const paidBookings = bookings.filter(isPaidRequest)



  const stats = useMemo(() => {
    const monthlyRevenue = bookings
      .filter((booking) => isRevenueBooking(booking) && isInCurrentMonth(booking.createdAt))
      .reduce((total, booking) => total + getPlanPrice(booking.pricingPlan), 0)

    return [
      { Icon: Users, label: 'Active Students', value: String(registeredUsers.length) },
      { Icon: CalendarCheck, label: 'Trial Requests', value: String(trialBookings.length) },
      { Icon: GraduationCap, label: 'Courses Managed', value: String(curriculum.length) },
      { Icon: DollarSign, label: 'Monthly Revenue', value: formatCurrency(monthlyRevenue) },
    ]
  }, [registeredUsers.length, trialBookings.length, bookings])

  useEffect(() => {
    let cancelled = false

    async function fetchUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch users.')
        }

        if (!cancelled) {
          setRegisteredUsers(data.users || [])
          setUsersError('')
        }
      } catch (err) {
        if (!cancelled) {
          setUsersError(err instanceof Error ? err.message : 'Could not fetch users.')
        }
      }
    }

    async function fetchBookings() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch bookings.')
        }

        if (!cancelled) {
          setBookings(data.bookings || [])
          setBookingsError('')
        }
      } catch (err) {
        if (!cancelled) {
          setBookingsError(err instanceof Error ? err.message : 'Could not fetch bookings.')
        }
      }
    }

    function refreshDashboardData() {
      fetchUsers()
      fetchBookings()
    }

    refreshDashboardData()
    const intervalId = window.setInterval(refreshDashboardData, STATS_REFRESH_MS)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!reviewPopoverOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (reviewButtonRef.current && !reviewButtonRef.current.contains(event.target as Node)) {
        setReviewPopoverOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [reviewPopoverOpen])

  const updateBooking = async (id: string, updates: { status?: string; paymentStatus?: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        const data = await res.json()
        setBookings(prev => prev.map(b => b._id === id ? { ...b, ...updates } : b))
        setSelectedBooking(prev => prev && prev._id === id ? { ...prev, ...updates } : prev)
        if (updates.status && data.emailSent === false) {
          console.error('Booking updated but email failed:', data.emailError)
          alert(`Booking updated, but the email could not be sent.\n\n${data.emailError || 'Unknown error'}\n\nIf you use Vercel, add EMAIL_USER and EMAIL_PASS in your project environment variables, then redeploy.`)
        }
      }
    } catch (err) {
      console.error('Error updating booking', err)
    }
  }

  const confirmTrialBooking = (id: string) => {
    updateBooking(id, { status: '🟢 Confirmed' })
  }

  const rejectTrialBooking = (id: string) => {
    updateBooking(id, { status: '🔴 Cancelled' })
  }

  const confirmPaidBooking = (id: string) => {
    updateBooking(id, { status: '🟢 Confirmed', paymentStatus: '🟢 Paid' })
  }

  const rejectPaidBooking = (id: string) => {
    updateBooking(id, { status: '🔴 Cancelled', paymentStatus: '🔴 Failed' })
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id))
        setSelectedBooking(prev => prev && prev._id === id ? null : prev)
      }
    } catch (err) {
      console.error('Error deleting booking', err)
    }
  }

  const formatBookingDate = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsed.getTime())) {
      return date || 'Not provided'
    }

    return parsed.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatShortDate = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return date || '—'
    return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const formatDisplayTime = (time: string) => {
    if (!time) return '—'
    const [h, m] = time.split(':').map(Number)
    if (Number.isNaN(h)) return time
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m || 0).padStart(2, '0')} ${period}`
  }

  const displayTrialStatus = (status?: string) => {
    if (!status) return 'Pending'
    if (status.includes('Confirmed') || status.includes('Accepted')) return 'Accepted'
    if (status.includes('Cancelled') || status.includes('Rejected')) return 'Rejected'
    if (status.includes('Pending')) return 'Pending'
    return status
  }

  const pendingCount = bookings.filter(b => isTrialPending(b) || isPaidPending(b)).length

  const scrollToPaidBookings = () => {
    const el = document.getElementById('paid-bookings-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdfFile) {
      alert("Please select a PDF file.")
      return
    }
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("title", resourceForm.title)
      formData.append("description", resourceForm.description)
      formData.append("subject", resourceForm.subject)
      formData.append("pdf", pdfFile)

      const res = await fetch(`${API_BASE_URL}/api/resources`, {
        method: "POST",
        body: formData,
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to upload.")
      }
      
      alert("Resource uploaded successfully!")
      setResourceModalOpen(false)
      setResourceForm({ title: '', description: '', subject: '' })
      setPdfFile(null)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsUploading(false)
    }
  }



  return (
    <section className="section" style={{ background: 'var(--surface-2)', minHeight: '80vh' }}>
      <div className="section-inner">
        <div className="section-header" style={{ textAlign: 'left', marginLeft: 0, marginBottom: 36 }}>
          <div className="section-tag gold">Admin Panel</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Admin Dashboard</h1>
          <p>Manage lesson requests, students, courses, and recent activity from one place.</p>
        </div>

        <div className="admin-stats-grid">
          {stats.map(({ Icon, label, value }) => (
            <div className="admin-card" key={label}>
              <div className="admin-card-icon">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <div>
                <div className="admin-card-value">{value}</div>
                <div className="admin-card-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-content-grid">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Registered Users</h2>
              <span>{registeredUsers.length} total</span>
            </div>
            <div className="admin-request-list">
              {usersError && <div className="auth-error">{usersError}</div>}
              {!usersError && registeredUsers.length === 0 && (
                <div className="admin-request-row">
                  <div>
                    <strong>No users found</strong>
                    <p>New signups will appear here after they are saved in MongoDB.</p>
                  </div>
                </div>
              )}
              {registeredUsers.map(user => (
                <div className="admin-request-row" key={user.id}>
                  <div>
                    <strong>{user.username}</strong>
                    <p>{user.email}</p>
                  </div>
                  <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Saved'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Quick Actions</h2>
              <MessageSquare size={20} strokeWidth={1.8} />
            </div>
            <div className="admin-actions">
              <div className="admin-review-bookings-wrap" ref={reviewButtonRef}>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => {
                    setReviewPopoverOpen(open => !open)
                    scrollToPaidBookings()
                  }}
                >
                  Review Bookings
                </button>
                {bookings.length > 0 && (
                  <span className="admin-review-badge" aria-label={`${bookings.length} bookings`}>
                    {bookings.length}
                  </span>
                )}
                {reviewPopoverOpen && (
                  <div className="admin-review-popover">
                    <strong>{bookings.length} Bookings</strong>
                    <ul>
                      <li>{trialBookings.length} trial / unsure</li>
                      <li>{paidBookings.length} paid</li>
                      <li>{pendingCount} pending action</li>
                    </ul>
                  </div>
                )}
              </div>
              <button type="button" className="btn btn-primary">Manage Students</button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setResourceModalOpen(true)}>Upload Resource</button>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/resources')}>Manage Resources</button>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-panel" style={{ marginTop: 20 }}>
          <div className="admin-panel-header">
            <h2>Recent Trial Requests</h2>
            <span>{trialBookings.length} total</span>
          </div>
          {bookingsError && <div className="auth-error">{bookingsError}</div>}
          <div className="admin-table-container" style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Student</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Time</th>
                  <th style={{ padding: '12px' }}>Topic</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trialBookings.length === 0 && !bookingsError && (
                  <tr>
                    <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No trial requests found.</td>
                  </tr>
                )}
                {trialBookings.map(booking => (
                  <tr
                    key={booking._id}
                    className="admin-booking-row"
                    onClick={() => setSelectedBooking(booking)}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedBooking(booking)
                      }
                    }}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td style={{ padding: '12px', fontWeight: 500 }}>{booking.fullName}</td>
                    <td style={{ padding: '12px' }}><a href={`mailto:${booking.email}`} style={{ color: 'var(--gold)', textDecoration: 'none' }}>{booking.email}</a></td>
                    <td style={{ padding: '12px' }}>{formatBookingDate(booking.preferredDate)}</td>
                    <td style={{ padding: '12px' }}>{formatDisplayTime(booking.preferredTime)}</td>
                    <td style={{ padding: '12px' }}>{booking.subject}</td>
                    <td style={{ padding: '12px' }}>{displayTrialStatus(booking.status)}</td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {isTrialPending(booking) && (
                        <>
                          <button onClick={(event) => { event.stopPropagation(); confirmTrialBooking(booking._id) }} style={{ background: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>Accept</button>
                          <button onClick={(event) => { event.stopPropagation(); rejectTrialBooking(booking._id) }} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text)', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>Reject</button>
                        </>
                      )}
                      <button onClick={(event) => { event.stopPropagation(); deleteBooking(booking._id) }} style={{ background: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel" id="paid-bookings-section" style={{ marginTop: 20 }}>
          <div className="admin-panel-header">
            <h2>Paid Bookings</h2>
            <span>{paidBookings.length} total</span>
          </div>
          {bookingsError && <div className="auth-error">{bookingsError}</div>}
          <div className="admin-table-container" style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Student</th>
                  <th style={{ padding: '12px' }}>Topic</th>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Time</th>
                  <th style={{ padding: '12px' }}>Payment</th>
                  <th style={{ padding: '12px' }}>Booking</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paidBookings.length === 0 && !bookingsError && (
                  <tr>
                    <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No paid bookings found.</td>
                  </tr>
                )}
                {paidBookings.map(booking => (
                  <tr
                    key={booking._id}
                    className="admin-booking-row"
                    onClick={() => setSelectedBooking(booking)}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedBooking(booking)
                      }
                    }}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td style={{ padding: '12px', fontWeight: 500 }}>{booking.fullName}</td>
                    <td style={{ padding: '12px' }}>{booking.subject}</td>
                    <td style={{ padding: '12px' }}>{formatShortDate(booking.preferredDate)}</td>
                    <td style={{ padding: '12px' }}>{formatDisplayTime(booking.preferredTime)}</td>
                    <td style={{ padding: '12px' }}>{getPaymentStatus(booking)}</td>
                    <td style={{ padding: '12px' }}>{getBookingStatus(booking)}</td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {isPaidPending(booking) ? (
                        <>
                          <button onClick={(event) => { event.stopPropagation(); confirmPaidBooking(booking._id) }} style={{ background: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>Confirm</button>
                          <button onClick={(event) => { event.stopPropagation(); rejectPaidBooking(booking._id) }} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text)', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>Reject</button>
                        </>
                      ) : (
                        <button onClick={(event) => { event.stopPropagation(); setSelectedBooking(booking) }} style={{ background: 'var(--navy)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <div className="booking-details-overlay" role="dialog" aria-modal="true" aria-labelledby="booking-details-title" onClick={() => setSelectedBooking(null)}>
          <div className="booking-details-panel" onClick={(event) => event.stopPropagation()}>
            <div className="booking-details-header">
              <h2 id="booking-details-title">Booking Details</h2>
              <button type="button" className="booking-details-close" aria-label="Close booking details" onClick={() => setSelectedBooking(null)}>x</button>
            </div>

            <dl className="booking-details-list">
              <div>
                <dt>Name:</dt>
                <dd>{selectedBooking.fullName}</dd>
              </div>
              <div>
                <dt>Email:</dt>
                <dd><a href={`mailto:${selectedBooking.email}`}>{selectedBooking.email}</a></dd>
              </div>
              <div>
                <dt>Date:</dt>
                <dd>{formatBookingDate(selectedBooking.preferredDate)}</dd>
              </div>
              <div>
                <dt>Time:</dt>
                <dd>{formatDisplayTime(selectedBooking.preferredTime) || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Topic:</dt>
                <dd>{selectedBooking.subject || 'Not provided'}</dd>
              </div>
              {selectedBooking.pricingPlan && (
                <div>
                  <dt>Plan:</dt>
                  <dd>{selectedBooking.pricingPlan}</dd>
                </div>
              )}
              <div>
                <dt>Description:</dt>
                <dd>{selectedBooking.description || 'No description provided.'}</dd>
              </div>
              {isPaidRequest(selectedBooking) && (
                <div>
                  <dt>Payment:</dt>
                  <dd>{getPaymentStatus(selectedBooking)}</dd>
                </div>
              )}
              <div>
                <dt>Status:</dt>
                <dd>{isPaidRequest(selectedBooking) ? getBookingStatus(selectedBooking) : displayTrialStatus(selectedBooking.status)}</dd>
              </div>
            </dl>

            <div className="booking-details-actions">
              {isPaidRequest(selectedBooking) && isPaidPending(selectedBooking) && (
                <>
                  <button type="button" className="booking-action accept" onClick={() => confirmPaidBooking(selectedBooking._id)}>Confirm</button>
                  <button type="button" className="booking-action reject" onClick={() => rejectPaidBooking(selectedBooking._id)}>Reject</button>
                </>
              )}
              {isTrialRequest(selectedBooking) && isTrialPending(selectedBooking) && (
                <>
                  <button type="button" className="booking-action accept" onClick={() => confirmTrialBooking(selectedBooking._id)}>Accept</button>
                  <button type="button" className="booking-action reject" onClick={() => rejectTrialBooking(selectedBooking._id)}>Reject</button>
                </>
              )}
              <button type="button" className="booking-action delete" onClick={() => deleteBooking(selectedBooking._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {resourceModalOpen && (
        <div className="booking-details-overlay" role="dialog" aria-modal="true" onClick={() => setResourceModalOpen(false)}>
          <div className="booking-details-panel" onClick={(event) => event.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="booking-details-header">
              <h2>Upload Resource</h2>
              <button type="button" className="booking-details-close" onClick={() => setResourceModalOpen(false)}>x</button>
            </div>
            <form className="auth-form" style={{ marginTop: '20px' }} onSubmit={handleResourceSubmit}>
              <div className="auth-field">
                <label>Title</label>
                <input type="text" placeholder="e.g. Past Paper 2023" value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} required />
              </div>
              <div className="auth-field">
                <label>Description</label>
                <textarea placeholder="Description of the resource" value={resourceForm.description} onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })} required style={{ width: '100%', padding: '12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', minHeight: '80px', fontFamily: 'inherit' }} />
              </div>
              <div className="auth-field">
                <label>Subject</label>
                <input type="text" placeholder="e.g. Math AA HL" value={resourceForm.subject} onChange={e => setResourceForm({ ...resourceForm, subject: e.target.value })} required />
              </div>
              <div className="auth-field">
                <label>Choose PDF</label>
                <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} required style={{ padding: '8px 0' }} />
              </div>
              <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  )
}
