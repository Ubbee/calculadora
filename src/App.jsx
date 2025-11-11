import { IonIcon } from 'ionicons/components/ion-icon.js'
import Calculadora from './components/Calculadora.jsx'
import './styles/app.scss'

export default function App() {
  return (
    <div className="app">
      <main className="app__container" role="main">
        <div className="titulos redes">
          <h1 className="app__titulo" aria-label="Calculadora React">Calculadora </h1>
          <ul className="redes">
            <li><a href="https://www.linkedin.com/in/santiagocurotto" target='blank'><ion-icon name="logo-linkedin"></ion-icon></a></li>
            <li><a href="https://wa.me/5492612520758?text=Hola%20Santi,%20vi%20tu%20portfolio%20y%20me%20gustaría%20hablar%20con%20vos." target='blank'><ion-icon name="logo-whatsapp"></ion-icon></a></li>
            <li><a href="https://curotto-santiago-portfolio.netlify.app" target='blank'><ion-icon name="briefcase"></ion-icon></a></li>
          </ul>
        </div>
        <Calculadora />
      </main>
    </div>
  )
}
