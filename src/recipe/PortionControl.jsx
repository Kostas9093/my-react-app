// Portion control 
import React from 'react'

function PortionControl({ portionCount, setPortionCount }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Split into how many portions?</label>
      <select
        className="border p-2"
        value={portionCount}
        onChange={(e) => setPortionCount(Number(e.target.value))}
      >
        {[...Array(20)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
    </div>
  )
}

export default PortionControl
