import React, { useEffect, useState } from 'react'

export default function ParklandCalculator() {
  const [weight, setWeight] = useState('')
  const [tbsa, setTbsa] = useState('')
  const [timeSinceBurn, setTimeSinceBurn] = useState(0)
  const [dropFactor, setDropFactor] = useState(15)

  const [results, setResults] = useState({ total24h: 0, first8h: 0, next16h: 0, currentRate: 0 })

  useEffect(() => {
    calculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, tbsa, timeSinceBurn, dropFactor])

  function calculate() {
    const w = parseFloat(weight)
    const t = parseFloat(tbsa)
    const time = parseFloat(timeSinceBurn)
    const df = parseInt(dropFactor, 10)

    if (!w || w <= 0 || !t || t <= 0) {
      setResults({ total24h: 0, first8h: 0, next16h: 0, currentRate: 0 })
      return
    }

    const total = 4 * w * t
    const half = total / 2
    const safeTime = Math.max(0, Math.min(24, time || 0))
    let rate = 0

    if (safeTime < 8) {
      const remainingHours = 8 - safeTime
      const remainingMinutes = remainingHours * 60
      rate = (half * df) / remainingMinutes
    } else if (safeTime < 24) {
      const remainingHours = 24 - safeTime
      const remainingMinutes = remainingHours * 60
      rate = (half * df) / remainingMinutes
    } else {
      rate = 0
    }

    setResults({ total24h: Math.round(total), first8h: Math.round(half), next16h: Math.round(half), currentRate: Math.round(rate) })
  }

  return (
    <div>
      <div className="form-grid">
        <div className="form-group">
          <label>Weight (kg)</label>
          <input value={weight} onChange={e => setWeight(e.target.value)} type="number" min="1" step="0.1" placeholder="e.g. 70" />
        </div>
        <div className="form-group">
          <label>TBSA (%)</label>
          <input value={tbsa} onChange={e => setTbsa(e.target.value)} type="number" min="0" max="100" step="0.5" />
        </div>
        <div className="form-group">
          <label>Time Since Burn (hrs)</label>
          <input value={timeSinceBurn} onChange={e => setTimeSinceBurn(e.target.value)} type="number" min="0" max="24" step="0.5" />
        </div>
        <div className="form-group">
          <label>IV Drop Factor (gtts/ml)</label>
          <select value={dropFactor} onChange={e => setDropFactor(e.target.value)}>
            <option value={10}>10 (Macro)</option>
            <option value={15}>15 (Macro - Standard)</option>
            <option value={20}>20 (Macro)</option>
            <option value={60}>60 (Micro)</option>
          </select>
        </div>
      </div>

      <div className="results-grid mt-4">
        <div className="result-card primary">
          <span className="label">Total 24h Fluid</span>
          <span className="value">{results.total24h.toLocaleString()} <small>ml</small></span>
        </div>
        <div className="result-card">
          <span className="label">First 8 Hours</span>
          <span className="value">{results.first8h.toLocaleString()} <small>ml</small></span>
        </div>
        <div className="result-card">
          <span className="label">Next 16 Hours</span>
          <span className="value">{results.next16h.toLocaleString()} <small>ml</small></span>
        </div>
        <div className="result-card highlight">
          <span className="label">Current Drip Rate</span>
          <span className="value">{results.currentRate} <small>gtts/min</small></span>
        </div>
      </div>
    </div>
  )
}
