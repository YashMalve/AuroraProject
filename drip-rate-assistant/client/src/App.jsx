import React from 'react'
import ParklandCalculator from './components/ParklandCalculator'
import BurnCalculator from './components/BurnCalculator'
import Tracker from './components/Tracker'

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <div className="app-title-group">
            <h1>Drip-Rate Assistant</h1>
            <span className="app-subtitle">Burn Resuscitation CDS</span>
          </div>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="panel">
          <div className="panel-header"><h2>TBSA / Burn</h2></div>
          <div className="panel-body"><BurnCalculator /></div>
        </section>

        <section className="panel">
          <div className="panel-header"><h2>Parkland Formula</h2></div>
          <div className="panel-body"><ParklandCalculator /></div>
        </section>

        <section className="panel">
          <div className="panel-header"><h2>Resuscitation Tracker</h2></div>
          <div className="panel-body"><Tracker /></div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="safety-notice">
          <p><strong>Clinical Decision Support Only:</strong> This tool does not replace professional medical judgment.</p>
        </div>
      </footer>
    </div>
  )
}
