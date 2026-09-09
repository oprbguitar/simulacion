/* ------------------------------------------------------------------ *
 * Horizonte — primitivas de movimiento
 *
 * Capa propia inspirada en la gramática de motion-primitives y MagicUI,
 * reescrita sobre `motion/react` con los tokens de este producto: nada de
 * Tailwind, nada de degradados decorativos, nada de movimiento infinito
 * que no comunique estado.
 *
 * Regla de la casa: si una animación no explica un cambio de estado, no
 * entra. Todas respetan `prefers-reduced-motion` vía MotionConfig y los
 * cortocircuitos locales de cada primitiva.
 * ------------------------------------------------------------------ */
import { useEffect, type ReactNode } from 'react'
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { springs } from './tokens'

/**
 * Contador con resorte. El texto lo escribe directamente el MotionValue,
 * así que el primer render ya muestra la cifra final: los lectores de
 * pantalla y las pruebas nunca ven un número en tránsito al montar.
 */
export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number
  format: (value: number) => string
  className?: string
}) {
  const reduce = useReducedMotion()
  const animated = useSpring(value, { stiffness: 120, damping: 22, mass: 0.6 })
  const text = useTransform(animated, (latest) => format(latest))

  useEffect(() => {
    if (reduce) animated.jump(value)
    else animated.set(value)
  }, [value, animated, reduce])

  return (
    <motion.span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {text}
    </motion.span>
  )
}

/**
 * Ficha de variación: aparece cuando un indicador cambia y sube 14 px.
 * Comunica la dirección del cambio, no decora.
 */
export function DeltaChip({ delta, format }: { delta: number; format: (value: number) => string }) {
  const positive = delta > 0
  return (
    <motion.span
      className={positive ? 'delta-chip is-up' : 'delta-chip is-down'}
      initial={{ opacity: 0, y: 6, scale: 0.94 }}
      animate={{ opacity: 1, y: -14, scale: 1 }}
      exit={{ opacity: 0, y: -22 }}
      transition={springs.smooth}
      aria-hidden="true"
    >
      {positive ? '+' : '−'}
      {format(Math.abs(delta))}
    </motion.span>
  )
}

/**
 * Barrido de luz sobre texto. Se dispara sólo cuando cambia `trigger`
 * y corre dos ciclos: señala «esto es nuevo», no adorna permanentemente.
 */
export function TextSweep({ children, trigger }: { children: ReactNode; trigger: string | number }) {
  const reduce = useReducedMotion()
  return (
    <span key={reduce ? 'static' : trigger} className={reduce ? 'text-sweep is-static' : 'text-sweep'}>
      {children}
    </span>
  )
}

/**
 * Haz de borde (gramática MagicUI) reducido a un trazo del acento del
 * producto. Marca el control recomendado sin gritar.
 */
export function BorderBeam({ active = true }: { active?: boolean }) {
  if (!active) return null
  return <span className="border-beam" aria-hidden="true" />
}

/**
 * Onda que se expande una vez desde el centro de la escena. Se usa
 * cuando cambia la etapa, para que el ojo encuentre qué se movió.
 */
export function Ripple() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.span
      className="scene-ripple"
      initial={{ opacity: 0.5, scale: 0.35 }}
      animate={{ opacity: 0, scale: 1.6 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      aria-hidden="true"
    />
  )
}
