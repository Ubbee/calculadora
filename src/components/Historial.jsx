import React from 'react'

export default function Historial({ items = [], onLimpiar }) {
  return (
    <section className="historial" aria-label="Historial de operaciones">
      <div className="historial__header">
        <h2 className="historial__titulo">Historial</h2>
        <button type="button" className="btn historial__borrar" onClick={onLimpiar} aria-label="Limpiar historial">
          Limpiar
        </button>
      </div>
      {items.length === 0 ? (
        <p className="historial__vacio">Sin operaciones todavía.</p>
      ) : (
        <ul className="historial__lista">
          {items.map((h) => (
            <li key={h.id} className="historial__item">
              <div className="history__expr">{h.expresion}</div>
              <div className="historial__resultado">= {h.resultado}</div>
              <time className="historial__tiempo" dateTime={new Date(h.tiempo).toISOString()}>
                {new Date(h.tiempo).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
