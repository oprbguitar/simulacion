import type { LayerId, ScenarioResult } from '../domain/types'
import { Icon } from './Icon'

const layers: Array<{ id: LayerId; title: string; copy: string; tone: string }> = [
  { id: 'finishes', title: 'Casa familiar', copy: 'Tu punto de partida', tone: 'green' },
  { id: 'site', title: 'Terreno', copy: 'El espacio donde crecer', tone: 'blue' },
  { id: 'structure', title: 'Cimientos', copy: 'La base que da seguridad', tone: 'orange' },
  { id: 'systems', title: 'Hogar futuro', copy: 'Tu meta por construir', tone: 'gray' },
]

export function LifeScene({ result, onLayerChange }: { result: ScenarioResult; onLayerChange: (layer: LayerId) => void }) {
  return (
    <section className={`life-scene stage-${result.state.sceneStage}`} aria-labelledby="scene-title">
      <h1 className="sr-only">Horizonte: simulador visual de vivienda</h1>
      <img src="/assets/horizonte-life-scene-v1.png" alt="Casa familiar peruana en corte, con patio, terreno, cimientos y un hogar futuro dibujado bajo tierra." />
      <div className="scene-state" aria-live="polite">
        <span><Icon name={result.state.sceneStage === 'rental' ? 'renting' : result.state.sceneStage === 'family' ? 'family' : 'home'} /></span>
        <div><small>Tu historia en marcha</small><h2 id="scene-title">{result.sceneLabel}</h2></div>
      </div>
      <div className="scene-progress" aria-hidden="true"><span /></div>
      <div className="scene-labels" aria-label="Capas de la escena">
        {layers.map((layer) => (
          <button key={layer.id} className={`scene-label tone-${layer.tone}`} onClick={() => onLayerChange(layer.id)} aria-pressed={result.state.selectedLayer === layer.id} aria-label={`${layer.title}. ${layer.copy}`}>
            <span className="label-line" aria-hidden="true" /><span className="label-dot" aria-hidden="true" />
            <span className="label-copy"><strong>{layer.title}</strong><small>{layer.copy}</small></span>
          </button>
        ))}
      </div>
      <p className="scene-disclaimer">Simulación educativa · montos referenciales</p>
    </section>
  )
}
