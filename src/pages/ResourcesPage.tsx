import { Download, FileText, Video } from 'lucide-react'
import PageHeader from '../components/PageHeader'
//this is it 

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        title="Student Resources"
        subtitle="Free study materials, guides, and tools for IB Mathematics."
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'rgba(15,32,68,0.05)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--navy)' }}>
              <FileText size={28} />
            </div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>Past Papers Archive</h3>
            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '24px' }}>Access a comprehensive collection of past IB Math AA & AI papers with complete markschemes.</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Download size={16} /> Download PDF
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'rgba(240,192,64,0.15)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--gold-dark)' }}>
              <Video size={28} />
            </div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>Concept Videos</h3>
            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '24px' }}>Short, targeted video explanations covering the most challenging topics in the IB syllabus.</p>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', gap: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
              Watch Now
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'rgba(15,32,68,0.05)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--navy)' }}>
              <FileText size={28} />
            </div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>Formula Booklets</h3>
            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '24px' }}>Annotated versions of the official IB Mathematics formula booklets to help you understand when to use them.</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Download size={16} /> Download PDF
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
