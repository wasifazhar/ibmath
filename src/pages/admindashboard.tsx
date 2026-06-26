import { useEffect, useState } from 'react'
import { CalendarCheck, DollarSign, GraduationCap, MessageSquare, Users } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface RegisteredUser {
  id: string
  username: string
  email: string
  createdAt?: string
}

const stats = [
  { Icon: Users, label: 'Active Students', value: '128' },
  { Icon: CalendarCheck, label: 'Trial Requests', value: '24' },
  { Icon: GraduationCap, label: 'Courses Managed', value: '6' },
  { Icon: DollarSign, label: 'Monthly Revenue', value: '$3,420' },
]

const requests = [
  { name: 'Mariam Khan', course: 'IB Math AA HL', status: 'New' },
  { name: 'Oliver Smith', course: 'GCSE Mathematics', status: 'Follow up' },
  { name: 'Aadam K.', course: 'AP Calculus', status: 'Scheduled' },
]

export default function AdminDashboard() {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [usersError, setUsersError] = useState('')

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
        }
      } catch (err) {
        if (!cancelled) {
          setUsersError(err instanceof Error ? err.message : 'Could not fetch users.')
        }
      }
    }

    fetchUsers()

    return () => {
      cancelled = true
    }
  }, [])

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
              <button type="button" className="btn btn-gold">Review Bookings</button>
              <button type="button" className="btn btn-primary">Manage Students</button>
              <button type="button" className="btn btn-outline">Update Courses</button>
            </div>
          </div>
        </div>

        <div className="admin-panel" style={{ marginTop: 20 }}>
          <div className="admin-panel-header">
            <h2>Recent Trial Requests</h2>
            <span>Today</span>
          </div>
          <div className="admin-request-list">
            {requests.map(request => (
              <div className="admin-request-row" key={request.name}>
                <div>
                  <strong>{request.name}</strong>
                  <p>{request.course}</p>
                </div>
                <span>{request.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
