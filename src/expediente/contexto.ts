import { createContext } from 'react'

/**
 * Dentro del cajón de La Ruta el detalle se lee como una lista plegable:
 * cada bloque muestra solo su título hasta que se abre. En la página del
 * expediente el contexto vale false y todo se muestra corrido.
 */
export const PlegadoContext = createContext(false)

/** En el documento descargable no hay clics: todo lo que se pliega va abierto. */
export const DocumentoCompletoContext = createContext(false)
