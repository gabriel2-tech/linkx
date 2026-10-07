import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('link runtime error:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui, sans-serif', background: '#f5f7fa' }}>
          <div style={{ width: 'min(100%, 560px)', background: '#fff', border: '1px solid #d9dee7', borderRadius: 14, padding: 28, boxShadow: '0 8px 28px rgba(16,24,40,.08)' }}>
            <div style={{ color: '#1877f2', fontSize: 38, fontWeight: 800, marginBottom: 10 }}>link</div>
            <h1>Une erreur est survenue</h1>
            <p>L’application n’a pas pu démarrer. Le détail technique est affiché ci-dessous.</p>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: '#fff1f1', border: '1px solid #ffd1d1', borderRadius: 8, padding: 12, color: '#8b1e1e' }}>{this.state.error?.stack || this.state.error?.message}</pre>
            <button type="button" onClick={() => window.location.reload()} style={{ width: '100%', minHeight: 48, border: 0, borderRadius: 10, background: '#1877f2', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Recharger</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function StartupError({ error }) {
  return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui, sans-serif', background: '#f5f7fa' }}><div style={{ width: 'min(100%, 560px)', background: '#fff', border: '1px solid #d9dee7', borderRadius: 14, padding: 28 }}><div style={{ color: '#1877f2', fontSize: 38, fontWeight: 800 }}>link</div><h1>Erreur au démarrage</h1><p>Le navigateur a rencontré cette erreur :</p><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#8b1e1e' }}>{error?.stack || error?.message || String(error)}</pre></div></div>
}

const root = createRoot(document.getElementById('root'))

import('./App.jsx')
  .then(({ default: App }) => {
    root.render(
      <StrictMode>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </StrictMode>,
    )
  })
  .catch((error) => {
    console.error('link startup error:', error)
    root.render(
      <AppErrorBoundary error={error}>
        <div />
      </AppErrorBoundary>,
    )
  })
