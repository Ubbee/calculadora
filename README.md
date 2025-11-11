# Calculadora React (Vite + SCSS) — Español Argentino

Calculadora simple y pulida hecha con **React**, **Vite**, **JavaScript** y **SCSS**. Soporta teclado, diseño responsive, buenas prácticas, `useReducer` y **historial** (persistido en `localStorage`).

## Requisitos
- Node.js 18+
- npm / pnpm / yarn

## Cómo correr
```bash
npm install
npm run dev
```

## Atajos de teclado
- **AC**: limpiar todo (`Esc`)
- **⌫**: borrar último dígito (`Backspace`/`Delete`)
- **±**: cambiar signo
- **%**: porcentaje
- **Enter/=`**: calcular
- Negativos después de operador: `7 * -2`, `123 / -2`, etc.

## Estructura
```
react-calculator/
  public/
    favicon.svg
  src/
    components/
      Calculadora.jsx
      Pantalla.jsx
      Boton.jsx
      Historial.jsx
    styles/
      _variables.scss
      _mixins.scss
      globals.scss
      app.scss
    App.jsx
    main.jsx
  index.html
  package.json
  vite.config.js
```
