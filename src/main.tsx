import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { App } from './App'
import { Expediente } from './expediente/Expediente'
import { Ruta } from './ruta/Ruta'
import { Studio } from './studio/Studio'
import './ruta.css'
import './expediente.css'
import './portal.css'
import './studio-onepage.css'
import './motion.css'

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el root de la aplicación.')

// La superficie principal es 'La Ruta', el recorrido jugable. El mismo motor
// y el mismo catálogo alimentan '/_expediente', que es el documento denso.
// '/_legacy' conserva el simulador de una pantalla y '/_studio' lo edita.
const ruta = window.location.pathname
const surface =
  ruta === '/_studio' ? <Studio /> : ruta === '/_legacy' ? <App /> : ruta === '/_expediente' ? <Expediente /> : <Ruta />

createRoot(root).render(
  <StrictMode>
    {/* `reducedMotion="user"` desactiva transform/opacity animadas cuando el
        sistema lo pide; las excepciones CSS viven en motion.css. */}
    <MotionConfig reducedMotion="user">{surface}</MotionConfig>
  </StrictMode>,
)
