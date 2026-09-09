import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'arrow-right'
  | 'calendar'
  | 'check'
  | 'close'
  | 'compare'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'family'
  | 'hard-hat'
  | 'home'
  | 'info'
  | 'land'
  | 'layers'
  | 'lightbulb'
  | 'menu'
  | 'pause'
  | 'play'
  | 'redo'
  | 'renting'
  | 'rotate'
  | 'settings'
  | 'shield'
  | 'sprout'
  | 'undo'
  | 'wallet'
  | 'warning'
  | 'none'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  }

  let content: ReactNode
  switch (name) {
    case 'arrow-right':
      content = <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>
      break
    case 'calendar':
      content = <><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M7 3v4M17 3v4M3 10h18" /><path d="M7 14h.01M11 14h.01M15 14h.01M7 18h.01M11 18h.01" /></>
      break
    case 'check':
      content = <path d="m5 12 4 4L19 6" />
      break
    case 'close':
      content = <path d="M6 6l12 12M18 6 6 18" />
      break
    case 'compare':
      content = <><path d="M12 3v18" /><path d="M4 8h5M4 8l2.5 5H1.5L4 8zM15 6h5M17.5 6 20 11h-5l2.5-5z" /></>
      break
    case 'chevron-down':
      content = <path d="m6 9 6 6 6-6" />
      break
    case 'chevron-left':
      content = <path d="m14 6-6 6 6 6" />
      break
    case 'chevron-right':
      content = <path d="m10 6 6 6-6 6" />
      break
    case 'family':
      content = <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M14 20a4 4 0 0 1 6.5-3.1" /><path d="M5 14.5c1.5-1.3 3.5-1.3 5 0" /></>
      break
    case 'hard-hat':
      content = <><path d="M4 15a8 8 0 0 1 16 0v2H4z" /><path d="M2 17h20M12 7v8M8 9.5h8" /></>
      break
    case 'home':
      content = <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>
      break
    case 'info':
      content = <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>
      break
    case 'land':
      content = <><path d="m3 18 5-8 4 4 4-7 5 11H3z" /><path d="M15 14h3M16.5 11v5M19 16l-2-2" /></>
      break
    case 'layers':
      content = <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>
      break
    case 'lightbulb':
      content = <><path d="M9 18h6M10 21h4" /><path d="M8.2 14.5A6 6 0 1 1 15.8 14.5c-.9.8-1.5 1.6-1.7 2.5H9.9c-.2-.9-.8-1.7-1.7-2.5z" /><path d="M12 2v1M4.9 4.9l.7.7M2 12h1M19.1 4.9l-.7.7M22 12h-1" /></>
      break
    case 'menu':
      content = <><path d="M4 7h16M4 12h16M4 17h16" /></>
      break
    case 'pause':
      content = <><path d="M8 5v14M16 5v14" /></>
      break
    case 'play':
      content = <path d="m8 5 11 7-11 7z" />
      break
    case 'redo':
      content = <><path d="M17 7h4v4" /><path d="M20 7a8 8 0 1 0 1 8" /></>
      break
    case 'renting':
      content = <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /><path d="M17 15h.01" /></>
      break
    case 'rotate':
      content = <><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" /><path d="M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16" /><path d="M4 20v-4h4" /></>
      break
    case 'settings':
      content = <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.5h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2.5V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14h-.2a1.7 1.7 0 0 0-1.6 1z" /></>
      break
    case 'shield':
      content = <><path d="M12 3 20 6v5c0 5-3.2 8-8 10-4.8-2-8-5-8-10V6z" /><path d="m8 12 2.5 2.5L16 9" /></>
      break
    case 'sprout':
      content = <><path d="M12 21V10" /><path d="M12 11C7 11 4 8 4 4c4 0 8 2 8 7zM12 13c0-4 3-7 8-7 0 4-3 7-8 7z" /><path d="M7 21h10" /></>
      break
    case 'undo':
      content = <><path d="M7 7H3v4" /><path d="M4 7a8 8 0 1 1-1 8" /></>
      break
    case 'wallet':
      content = <><path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" /><path d="M4 6V4h11a2 2 0 0 1 2 2" /><path d="M15 12h5M17 12v.01" /></>
      break
    case 'warning':
      content = <><path d="m12 3 9 17H3z" /><path d="M12 9v4M12 16h.01" /></>
      break
    case 'none':
      content = <><circle cx="12" cy="12" r="9" /><path d="m7 7 10 10" /></>
      break
  }

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...common} {...props}>{content}</svg>
}
