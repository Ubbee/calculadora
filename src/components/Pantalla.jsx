import React from 'react'

export default function Pantalla({ previo, operador, actual }) {
  return (
    <div className="display" role="region" aria-live="polite" aria-atomic="true">
      <div className="display__chico">
        {previo !== null && (
          <span>
            {previo}{' '}
            <strong>{operador || ''}</strong>
          </span>
        )}
      </div>
      <div className="display__main" data-testid="display-main">
        {actual ?? 0}
      </div>
    </div>
  )
}
