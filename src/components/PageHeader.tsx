interface Props {
  tag?: string
  title: string
  subtitle: string
  accent?: string // word(s) in title to colour gold
}

export default function PageHeader({ tag, title, subtitle, accent }: Props) {
  const parts = accent
    ? title.split(accent)
    : [title]

  return (
    <div className="page-hero">
      <div className="page-hero-bg" />
      <div className="page-hero-inner">
        {tag && <div className="section-tag" style={{ marginBottom: 16 }}>{tag}</div>}
        <h1 className="page-hero-title">
          {accent ? (
            <>
              {parts[0]}
              <span className="hero-accent">{accent}</span>
              {parts[1]}
            </>
          ) : title}
        </h1>
        <p className="page-hero-sub">{subtitle}</p>
      </div>
    </div>
  )
}
