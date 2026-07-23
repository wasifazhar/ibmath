import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_REACT_APP_BASE_URL || "https://backend-olive-alpha-20.vercel.app"
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '')

interface Resource {
  _id: string
  title: string
  description: string
  subject: string
  viewUrl: string
  downloadUrl: string
}

export default function ManageResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [resourcesError, setResourcesError] = useState('')
  const [resourceSearchQuery, setResourceSearchQuery] = useState('')
  const [editResourceModalOpen, setEditResourceModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources`)
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Could not fetch resources.')
        setResources(data.resources || [])
        setResourcesError('')
      } catch (err) {
        setResourcesError(err instanceof Error ? err.message : 'Could not fetch resources.')
      }
    }
    fetchResources()
  }, [])

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(resourceSearchQuery.toLowerCase()) || 
    r.description.toLowerCase().includes(resourceSearchQuery.toLowerCase()) || 
    r.subject.toLowerCase().includes(resourceSearchQuery.toLowerCase())
  )

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setResources(prev => prev.filter(r => r._id !== id))
      } else {
        const data = await res.json()
        alert(data.message || 'Failed to delete resource')
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleEditResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingResource) return
    setIsUploading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources/${editingResource._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingResource.title,
          description: editingResource.description,
          subject: editingResource.subject,
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update.')
      }
      const data = await res.json()
      setResources(prev => prev.map(r => r._id === data.resource._id ? data.resource : r))
      setEditResourceModalOpen(false)
      setEditingResource(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="section" style={{ background: 'var(--surface-2)', minHeight: '80vh' }}>
      <div className="section-inner" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>
        
        <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <div className="section-header" style={{ textAlign: 'left', marginLeft: 0, marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>Manage Resources</h1>
          <p>Search, edit, or delete documents uploaded to the platform.</p>
        </div>

        <div className="admin-panel">
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search resources by title, subject or keyword..." 
              value={resourceSearchQuery}
              onChange={(e) => setResourceSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
            />
          </div>

          {resourcesError && <div className="auth-error">{resourcesError}</div>}
          
          <div className="admin-table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>Subject</th>
                  <th style={{ padding: '12px' }}>Description</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.length === 0 && !resourcesError && (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No resources found.</td>
                  </tr>
                )}
                {filteredResources.map(resource => (
                  <tr key={resource._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>{resource.title}</td>
                    <td style={{ padding: '12px' }}>{resource.subject}</td>
                    <td style={{ padding: '12px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{resource.description}</td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button onClick={() => { setEditingResource(resource); setEditResourceModalOpen(true); }} style={{ background: 'var(--gold)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>Edit</button>
                      <button onClick={() => handleDeleteResource(resource._id)} style={{ background: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editResourceModalOpen && editingResource && (
        <div className="booking-details-overlay" role="dialog" aria-modal="true" onClick={() => setEditResourceModalOpen(false)}>
          <div className="booking-details-panel" onClick={(event) => event.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="booking-details-header">
              <h2>Edit Resource</h2>
              <button type="button" className="booking-details-close" onClick={() => setEditResourceModalOpen(false)}>x</button>
            </div>
            <form className="auth-form" style={{ marginTop: '20px' }} onSubmit={handleEditResourceSubmit}>
              <div className="auth-field">
                <label>Title</label>
                <input type="text" placeholder="e.g. Past Paper 2023" value={editingResource.title} onChange={e => setEditingResource({ ...editingResource, title: e.target.value })} required />
              </div>
              <div className="auth-field">
                <label>Description</label>
                <textarea placeholder="Description of the resource" value={editingResource.description} onChange={e => setEditingResource({ ...editingResource, description: e.target.value })} required style={{ width: '100%', padding: '12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', minHeight: '80px', fontFamily: 'inherit' }} />
              </div>
              <div className="auth-field">
                <label>Subject</label>
                <input type="text" placeholder="e.g. Math AA HL" value={editingResource.subject} onChange={e => setEditingResource({ ...editingResource, subject: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={isUploading}>
                {isUploading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
