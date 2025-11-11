<<<<<<< HEAD
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
=======
# 🧮 Calculadora React

Calculadora web moderna desarrollada con **React**, **JavaScript** y **SCSS**, pensada para ofrecer una experiencia fluida, atractiva y funcional.  
Su diseño limpio, modo oscuro y animaciones sutiles acompañan una lógica precisa y optimizada para realizar cálculos con eficiencia.

---

## 🚀 Características principales

- ✴️ **Operaciones básicas y avanzadas** (suma, resta, multiplicación, división, potencias, raíz cuadrada, etc.)
- ➕ **Soporte para números negativos** y expresiones como `7 × -2` o `123 ÷ -3`
- 💾 **Historial interactivo y persistente** con almacenamiento en `localStorage`
- 🧠 **Gestión de estado con `useReducer`**, priorizando escalabilidad y legibilidad
- 💡 **Diseño responsive y moderno**, con efectos suaves y colores en equilibrio visual
- 🔢 **Compatibilidad con teclado**: escribí directamente los números y operadores
- 🎨 **Estilos modulares en SCSS** con variables bilingües (ES + EN) y un sistema de sombreado elegante

---

## 🛠️ Tecnologías utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [JavaScript (ES6+)](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [SCSS](https://sass-lang.com/)
- [Ionicons / React Icons](https://react-icons.github.io/react-icons/)
- [LocalStorage API](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)

---

## ⚙️ Instalación y ejecución local

1. Cloná este repositorio:
   ```bash
   git clone https://github.com/Ubbee/calculadora.git

2. Entrá a la carpeta del proyecto:
   ```bash
   cd calculadora

4. Instalá las dependencias:
   ```bash
   npm install

6. Iniciá el servidor de desarrollo:
   ```bash
   npm run dev

8. Abrí la aplicación en tu navegador
>>>>>>> 620e2a15440ab9076a2c249b943aa799ee633254
