import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { App } from './App'
import { Studio } from './studio/Studio'
import './portal.css'
import './studio-onepage.css'
import './motion.css'

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el root de la aplicación.')

const surface = window.location.pathname === '/_studio' ? <Studio /> : <App />

createRoot(root).render(
  <StrictMode>
    {/* `reducedMotion="user"` desactiva transform/opacity animadas cuando el
        sistema lo pide; las excepciones CSS viven en motion.css. */}
    <MotionConfig reducedMotion="user">{surface}</MotionConfig>
  </StrictMode>,
)
