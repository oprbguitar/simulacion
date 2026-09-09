import type { PointerEvent } from 'react'
import { useReducedMotion, useSpring } from 'motion/react'
import { springs } from './tokens'

/**
 * Parallax de puntero: devuelve estilos y handlers para desplazar una
 * imagen unos píxeles siguiendo el cursor. Se desactiva con
 * `prefers-reduced-motion` y en punteros gruesos (táctil), donde no hay
 * hover que lo justifique.
 */
export function usePointerParallax(strength = 10) {
  const reduce = useReducedMotion()
  const x = useSpring(0, springs.soft)
  const y = useSpring(0, springs.soft)
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const enabled = !reduce && fine

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!enabled) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * -strength)
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * -strength)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { style: { x, y }, onPointerMove, onPointerLeave, enabled }
}
