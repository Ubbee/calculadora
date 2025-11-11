import React from 'react'

export default function Boton({ etiqueta, onClick, className = '', ariaEtiqueta, dataKey }) {
  return (
    <button
      type="button"
      className={`btn ${className}`}
      onClick={onClick}
      aria-label={ariaEtiqueta || etiqueta}
      data-key={dataKey}
    >
      {etiqueta}
    </button>
  )
}
