import React, { useEffect, useReducer, useCallback } from 'react'
import Pantalla from './Pantalla.jsx'
import Boton from './Boton.jsx'
import Historial from './Historial.jsx'

const estadoInicial = {
  actual: '0',
  previo: null,
  operador: null,
  sobreescribir: false,
  memoria: 0,
  ultimoFueOperador: false,
  historial: [],
}

function numeroSeguro(n) {
  if (n === 'Error') return NaN
  const v = typeof n === 'string' ? parseFloat(n) : n
  return Number.isFinite(v) ? v : NaN
}

function formatearNumero(n) {
  if (n === 'Error') return 'Error'
  const v = typeof n === 'number' ? n : parseFloat(n)
  if (!Number.isFinite(v)) return 'Error'
  return Number(Number(v.toFixed(12))).toString()
}

function evaluar({ actual, previo, operador }) {
  const a = numeroSeguro(previo)
  const b = numeroSeguro(actual)
  if (Number.isNaN(a) || Number.isNaN(b)) return '0'

  let resultado = 0
  switch (operador) {
    case '+':
      resultado = a + b
      break
    case '−':
      resultado = a - b
      break
    case '×':
      resultado = a * b
      break
    case '÷':
      if (b === 0) return 'Error'
      resultado = a / b
      break
    default:
      return actual
  }
  return formatearNumero(resultado)
}

function aplicarUnaria(op, actual) {
  const v = numeroSeguro(actual)
  if (Number.isNaN(v)) return 'Error'
  let res = v
  switch (op) {
    case 'x²':
      res = v * v
      break
    case 'x³':
      res = v * v * v
      break
    case '√':
      if (v < 0) return 'Error'
      res = Math.sqrt(v)
      break
    case '1/x':
      if (v === 0) return 'Error'
      res = 1 / v
      break
    default:
      return actual
  }
  return formatearNumero(res)
}

function reductor(estado, accion) {
  switch (accion.tipo) {
    case 'borrarTodo':
      return { ...estado, actual: '0', previo: null, operador: null, sobreescribir: false, ultimoFueOperador: false }
    case 'borrarUno': {
      if (estado.sobreescribir) return { ...estado, sobreescribir: false, actual: '0', ultimoFueOperador: false }
      if (estado.actual.length <= 1 || (estado.actual.startsWith('-') && estado.actual.length === 2)) {
        return { ...estado, actual: '0', ultimoFueOperador: false }
      }
      return { ...estado, actual: estado.actual.slice(0, -1), ultimoFueOperador: false }
    }
    case 'agregar': {
      const payload = accion.valor
      // permitir '-' como signo negativo al empezar un número nuevo
      if (payload === '-') {
        if (estado.sobreescribir || estado.ultimoFueOperador || estado.actual === '0') {
          return { ...estado, actual: '-', sobreescribir: false, ultimoFueOperador: false }
        }
        // si no estamos en un contexto de nuevo número, interpretarlo como resta
        return { ...estado, previo: estado.actual === '-' ? '0' : estado.actual, actual: '0', operador: '−', sobreescribir: false, ultimoFueOperador: True }
      }
      if (estado.sobreescribir) {
        return { ...estado, sobreescribir: false, actual: payload === '.' ? '0.' : payload, ultimoFueOperador: false }
      }
      if (payload === '0' && estado.actual === '0') return estado
      if (payload === '.' && estado.actual.includes('.')) return estado
      if ((estado.actual === '0' || estado.actual === '-') && payload !== '.') {
        return { ...estado, actual: estado.actual === '-' ? '-' + payload : payload, ultimoFueOperador: false }
      }
      return { ...estado, actual: estado.actual + payload, ultimoFueOperador: false }
    }
    case 'cambiarSigno': {
      if (estado.actual === '0') return estado
      if (estado.actual.startsWith('-')) return { ...estado, actual: estado.actual.slice(1), ultimoFueOperador: false }
      return { ...estado, actual: '-' + estado.actual, ultimoFueOperador: false }
    }
    case 'porcentaje': {
      const val = numeroSeguro(estado.actual)
      if (Number.isNaN(val)) return estado
      const res = (val / 100).toString()
      return { ...estado, actual: res, sobreescribir: true, ultimoFueOperador: false }
    }
    case 'unaria': {
      const valor = aplicarUnaria(accion.operacion, estado.actual)
      const entrada = { id: Date.now(), expresion: `${accion.operacion}(${estado.actual})`, resultado: valor, tiempo: Date.now() }
      return { ...estado, actual: valor, sobreescribir: true, ultimoFueOperador: false, historial: [entrada, ...estado.historial].slice(0, 200) }
    }
    case 'operador': {
      if (estado.operador && estado.previo !== null && estado.actual !== '-') {
        const valor = evaluar(estado)
        return { actual: valor, previo: valor === 'Error' ? null : valor, operador: accion.operador, sobreescribir: true, memoria: estado.memoria, ultimoFueOperador: true, historial: estado.historial }
      }
      return { previo: estado.actual === '-' ? '0' : estado.actual, actual: '0', operador: accion.operador, sobreescribir: false, memoria: estado.memoria, ultimoFueOperador: true, historial: estado.historial }
    }
    case 'igual': {
      if (estado.operador === null || estado.previo === null || estado.actual === '-') return estado
      const valor = evaluar(estado)
      const entrada = { id: Date.now(), expresion: `${estado.previo} ${estado.operador} ${estado.actual}`, resultado: valor, tiempo: Date.now() }
      return { actual: valor, previo: null, operador: null, sobreescribir: true, memoria: estado.memoria, ultimoFueOperador: false, historial: [entrada, ...estado.historial].slice(0, 200) }
    }
    case 'memoriaSumar': {
      const v = numeroSeguro(estado.actual)
      if (Number.isNaN(v)) return estado
      return { ...estado, memoria: estado.memoria + v, sobreescribir: true }
    }
    case 'memoriaRestar': {
      const v = numeroSeguro(estado.actual)
      if (Number.isNaN(v)) return estado
      return { ...estado, memoria: estado.memoria - v, sobreescribir: true }
    }
    case 'memoriaLeer': {
      return { ...estado, actual: formatearNumero(estado.memoria), sobreescribir: true }
    }
    case 'memoriaBorrar': {
      return { ...estado, memoria: 0 }
    }
    case 'historialLimpiar': {
      return { ...estado, historial: [] }
    }
    case 'historialCargar': {
      return { ...estado, historial: Array.isArray(accion.items) ? accion.items : [] }
    }
    default:
      return estado
  }
}

const TECLAS = {
  digitos: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
  mapaOperadores: {
    '+': '+',
    '-': '−',
    '*': '×',
    'x': '×',
    'X': '×',
    '/': '÷',
  }
}

export default function Calculadora() {
  const [estado, despachar] = useReducer(reductor, estadoInicial)

  const agregarDigito = (d) => despachar({ tipo: 'agregar', valor: d })
  const elegirOperador = (op) => despachar({ tipo: 'operador', operador: op })
  const calcular = () => despachar({ tipo: 'igual' })
  const borrarTodo = () => despachar({ tipo: 'borrarTodo' })
  const borrarUno = () => despachar({ tipo: 'borrarUno' })
  const cambiarSigno = () => despachar({ tipo: 'cambiarSigno' })
  const porcentaje = () => despachar({ tipo: 'porcentaje' })
  const aplicarUnariaAccion = (op) => despachar({ tipo: 'unaria', operacion: op })
  const memoriaSumar = () => despachar({ tipo: 'memoriaSumar' })
  const memoriaRestar = () => despachar({ tipo: 'memoriaRestar' })
  const memoriaLeer = () => despachar({ tipo: 'memoriaLeer' })
  const memoriaBorrar = () => despachar({ tipo: 'memoriaBorrar' })
  const historialLimpiar = () => despachar({ tipo: 'historialLimpiar' })

  const manejarTeclado = useCallback((e) => {
    const tecla = e.key

    if (tecla === '-') {
      if (estado.sobreescribir || estado.ultimoFueOperador || estado.actual === '0') {
        e.preventDefault()
        despachar({ tipo: 'agregar', valor: '-' })
        return
      }
      e.preventDefault()
      despachar({ tipo: 'operador', operador: TECLAS.mapaOperadores['-'] })
      return
    }

    if (TECLAS.digitos.includes(tecla)) {
      e.preventDefault()
      despachar({ tipo: 'agregar', valor: tecla })
      return
    }
    if (tecla in TECLAS.mapaOperadores) {
      e.preventDefault()
      despachar({ tipo: 'operador', operador: TECLAS.mapaOperadores[tecla] })
      return
    }
    if (tecla === 'Enter' || tecla === '=') {
      e.preventDefault()
      despachar({ tipo: 'igual' })
      return
    }
    if (tecla === 'Escape') {
      e.preventDefault()
      despachar({ tipo: 'borrarTodo' })
      return
    }
    if (tecla === 'Backspace' || tecla === 'Delete') {
      e.preventDefault()
      despachar({ tipo: 'borrarUno' })
      return
    }
    if (tecla === '%') {
      e.preventDefault()
      despachar({ tipo: 'porcentaje' })
      return
    }
  }, [estado.sobreescribir, estado.ultimoFueOperador, estado.actual])

  useEffect(() => {
    window.addEventListener('keydown', manejarTeclado)
    return () => window.removeEventListener('keydown', manejarTeclado)
  }, [manejarTeclado])

  // cargar historial de localStorage
  useEffect(() => {
    try {
      const guardado = localStorage.getItem('calc_historial_v1')
      if (guardado) {
        const parseado = JSON.parse(guardado)
        if (Array.isArray(parseado)) {
          despachar({ tipo: 'historialCargar', items: parseado })
        }
      }
    } catch { }
  }, [])

  // guardar historial en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('calc_historial_v1', JSON.stringify(estado.historial))
    } catch { }
  }, [estado.historial])

  return (
    <>
      <section className="calculadora" aria-label="Calculadora">
        <Pantalla previo={estado.previo} operador={estado.operador} actual={estado.actual} />

        <div className="teclas" role="grid" aria-label="Teclado calculadora">
          {/* memoria */}
          <Boton etiqueta="MC" className="tecla tecla--memo" onClick={memoriaBorrar} ariaEtiqueta="Borrar memoria" />
          <Boton etiqueta="MR" className="tecla tecla--memo" onClick={memoriaLeer} ariaEtiqueta="Leer memoria" />
          <Boton etiqueta="M−" className="tecla tecla--memo" onClick={memoriaRestar} ariaEtiqueta="Memoria menos" />
          <Boton etiqueta="M+" className="tecla tecla--memo" onClick={memoriaSumar} ariaEtiqueta="Memoria más" />

          {/* funciones */}
          <Boton etiqueta="x²" className="tecla tecla--func" onClick={() => aplicarUnariaAccion('x²')} ariaEtiqueta="Cuadrado" />
          <Boton etiqueta="x³" className="tecla tecla--func" onClick={() => aplicarUnariaAccion('x³')} ariaEtiqueta="Cubo" />
          <Boton etiqueta="√" className="tecla tecla--func" onClick={() => aplicarUnariaAccion('√')} ariaEtiqueta="Raíz cuadrada" />
          <Boton etiqueta="1/x" className="tecla tecla--func" onClick={() => aplicarUnariaAccion('1/x')} ariaEtiqueta="Inverso" />

          {/* control y operador */}
          <Boton etiqueta="AC" className="tecla tecla--accion" onClick={borrarTodo} ariaEtiqueta="Limpiar todo" />
          <Boton etiqueta="±" className="tecla tecla--accion" onClick={cambiarSigno} ariaEtiqueta="Cambiar signo" />
          <Boton etiqueta="%" className="tecla tecla--accion" onClick={porcentaje} ariaEtiqueta="Porcentaje" />
          <Boton etiqueta="÷" className="tecla tecla--operacion" onClick={() => elegirOperador('÷')} ariaEtiqueta="Dividir" />

          <Boton etiqueta="7" className="tecla" onClick={() => agregarDigito('7')} />
          <Boton etiqueta="8" className="tecla" onClick={() => agregarDigito('8')} />
          <Boton etiqueta="9" className="tecla" onClick={() => agregarDigito('9')} />
          <Boton etiqueta="×" className="tecla tecla--operacion" onClick={() => elegirOperador('×')} ariaEtiqueta="Multiplicar" />

          <Boton etiqueta="4" className="tecla" onClick={() => agregarDigito('4')} />
          <Boton etiqueta="5" className="tecla" onClick={() => agregarDigito('5')} />
          <Boton etiqueta="6" className="tecla" onClick={() => agregarDigito('6')} />
          <Boton etiqueta="−" className="tecla tecla--operacion" onClick={() => elegirOperador('−')} ariaEtiqueta="Restar" />

          <Boton etiqueta="1" className="tecla" onClick={() => agregarDigito('1')} />
          <Boton etiqueta="2" className="tecla" onClick={() => agregarDigito('2')} />
          <Boton etiqueta="3" className="tecla" onClick={() => agregarDigito('3')} />
          <Boton etiqueta="+" className="tecla tecla--operacion" onClick={() => elegirOperador('+')} ariaEtiqueta="Sumar" />

          <Boton etiqueta="⌫" className="tecla tecla--accion" onClick={borrarUno} ariaEtiqueta="Borrar" />
          <Boton etiqueta="0" className="tecla tecla--cero" onClick={() => agregarDigito('0')} />
          <Boton etiqueta="." className="tecla" onClick={() => agregarDigito('.')} ariaEtiqueta="Punto decimal" />
          <Boton etiqueta="=" className="tecla tecla--igual" onClick={calcular} ariaEtiqueta="Igual" />
        </div>
      </section>

      <Historial items={estado.historial} onLimpiar={historialLimpiar} />
    </>
  )
}
