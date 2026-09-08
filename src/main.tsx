import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Studio } from './studio/Studio'
import './styles.css'
import './portal.css'
import './studio-onepage.css'

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el root de la aplicación.')

createRoot(root).render(<StrictMode>{window.location.pathname === '/_studio' ? <Studio /> : <App />}</StrictMode>)
