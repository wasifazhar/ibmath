import { Download, FileText, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_REACT_APP_BASE_URL || "https://backend-olive-alpha-20.vercel.app"
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '')

interface ResourceItem {
  _id: string
  title: string
  description: string
  subject: string
  viewUrl: string
  downloadUrl: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resources`)
        if (!res.ok) throw new Error('Failed to fetch resources')
        const data = await res.json()
        setResources(data.resources || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [])

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <PageHeader 
        title="Student Resources" 
        subtitle="Free study materials, guides, and tools for IB Mathematics."
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        
        <div style={{ marginBottom: '40px', position: 'relative', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search resources by title, subject, or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '16px 20px 16px 48px', 
              borderRadius: '12px', 
              border: '1px solid rgba(0,0,0,0.1)', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }} 
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          
          {loading && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Loading resources...</div>}
          {error && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>}
          
          {filteredResources.map(resource => (
            <div key={resource._id} style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ background: 'rgba(15,32,68,0.05)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--navy)' }}>
                <FileText size={28} />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{resource.subject}</div>
              <h3 style={{ color: 'var(--navy)', fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>{resource.title}</h3>
              <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '24px' }}>{resource.description}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={resource.viewUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', gap: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                  View
                </a>
                <a href={resource.downloadUrl} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: '8px' }}>
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          ))}

          {!loading && resources.length > 0 && filteredResources.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No resources found matching "{searchQuery}".
            </div>
          )}

          {!loading && resources.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No resources available yet. Check back later!
            </div>
          )}
        </div>
      </div>
    </>
  )
}
