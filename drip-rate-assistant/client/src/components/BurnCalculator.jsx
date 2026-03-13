import React, { useState, useEffect } from 'react'

export default function BurnCalculator() {
  const [tbsa, setTbsa] = useState(0)

  useEffect(() => {
    // Notify parkland calculator if present via custom event
    const event = new CustomEvent('tbsa-change', { detail: { tbsa } })
    window.dispatchEvent(event)
  }, [tbsa])

  return (
    <div>
      <div id="body-map-container" className="body-map-container">
        <div className="placeholder-box">Body Map Placeholder (React)</div>
      </div>
      <div className="tbsa-result mt-3">
        <label>Total Body Surface Area Burned:</label>
        <div className="tbsa-value">
          <input type="number" value={tbsa} onChange={e => setTbsa(e.target.value)} min="0" max="100" step="0.5" />
          <span className="unit">%</span>
        </div>
      </div>
    </div>
  )
}
