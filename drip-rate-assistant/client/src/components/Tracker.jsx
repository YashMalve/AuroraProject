import React, { useEffect, useState } from 'react'

export default function Tracker() {
  const [target8h, setTarget8h] = useState(0)
  const [timeSinceBurn, setTimeSinceBurn] = useState(0)
  const [actualFluid, setActualFluid] = useState(0)
  const [statusText, setStatusText] = useState('Awaiting Patient Data')
  const [expectedPercent, setExpectedPercent] = useState(0)
  const [actualPercent, setActualPercent] = useState(0)

  useEffect(() => {
    function handleParklandUpdate(e) {
      const totals = e.detail || {}
      setTarget8h(totals.first8h || 0)
      setTimeSinceBurn(totals.timeSinceBurn || 0)
    }

    window.addEventListener('parkland-update', handleParklandUpdate)
    return () => window.removeEventListener('parkland-update', handleParklandUpdate)
  }, [])

  useEffect(() => {
    evaluateProgress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target8h, timeSinceBurn, actualFluid])

  function evaluateProgress() {
    if (target8h === 0) {
      setStatusText('Awaiting Patient Data')
      setExpectedPercent(0)
      setActualPercent(0)
      return
    }

    let expectedFluid = 0
    if (timeSinceBurn <= 8) expectedFluid = (target8h / 8) * timeSinceBurn
    else expectedFluid = target8h

    let expPct = (expectedFluid / target8h) * 100
    let actPct = (actualFluid / target8h) * 100
    expPct = Math.min(100, Math.max(0, expPct))
    actPct = Math.min(100, Math.max(0, actPct))

    setExpectedPercent(expPct)
    setActualPercent(actPct)

    setStatusText(`${Math.round(actualFluid)}ml Delivered / ${Math.round(expectedFluid)}ml Expected`)
  }

  return (
    <div>
      <div className="progress-container">
        <div className="progress-labels">
          <span>Fluid Delivered</span>
          <span id="tracker-status-text">{statusText}</span>
        </div>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-track">
            <div className="progress-bar-fill expected" style={{ width: `${expectedPercent}%` }}></div>
            <div className="progress-bar-fill actual" style={{ width: `${actualPercent}%` }}></div>
          </div>
        </div>

        <div className="tracker-inputs mt-4">
          <div className="form-group">
            <label>Actual Fluid Delivered (ml)</label>
            <div className="input-with-button">
              <input type="number" value={actualFluid} onChange={e => setActualFluid(Number(e.target.value))} min="0" step="50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
