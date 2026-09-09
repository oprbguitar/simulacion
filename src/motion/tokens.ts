/* ------------------------------------------------------------------ *
 * Horizonte — tokens de movimiento
 * Toda duración, resorte y variante vive aquí. Ningún componente puede
 * inventar un número de animación fuera de esta escala.
 * ------------------------------------------------------------------ */
import type { Transition, Variants } from 'motion/react'

/** Resortes del producto. `snap` para controles, `smooth` para escena, `soft` para datos. */
export const springs = {
  snap: { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 },
  smooth: { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 },
  soft: { type: 'spring', stiffness: 150, damping: 26, mass: 1 },
} satisfies Record<string, Transition>

/** Curva seca de 160 ms para cambios de color y foco. */
export const dry: Transition = { duration: 0.16, ease: [0.2, 0, 0, 1] }

/** Entrada escalonada: el contenedor reparte, el hijo se levanta 6 px. */
export const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  shown: { opacity: 1, y: 0, transition: springs.smooth },
}

/** Props de presión reutilizables para cualquier control. */
export const pressable = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.985, y: 0 },
  transition: springs.snap,
} as const
