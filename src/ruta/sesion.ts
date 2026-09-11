import { PERFIL_INICIAL, type Perfil } from '../domain/life/motor'

/**
 * Lo que eligió la persona, guardado solo en su navegador. Sirve para que el
 * expediente en pantalla y el descargable muestren sus decisiones y no las
 * de ejemplo. Nunca sale del dispositivo.
 */
export interface Sesion {
  nombre: string
  perfil: Perfil
}

const CLAVE = 'horizonte:ruta:v1'

export function leerSesion(): Sesion | null {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return null
    const datos = JSON.parse(crudo) as Partial<Sesion>
    return { nombre: typeof datos.nombre === 'string' ? datos.nombre : '', perfil: { ...PERFIL_INICIAL, ...datos.perfil } }
  } catch {
    return null
  }
}

export function guardarSesion(sesion: Sesion) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion))
  } catch {
    // Navegación privada o almacenamiento bloqueado: la ruta sigue funcionando.
  }
}
