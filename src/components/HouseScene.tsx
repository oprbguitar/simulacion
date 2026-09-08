import { useId } from 'react'
import type { LayerId, ScenarioResult } from '../domain/types'
import { Icon } from './Icon'
import { OriginBadge } from './OriginBadge'

const layerLabels: Array<{ id: LayerId; label: string; icon: 'land' | 'layers' | 'settings' | 'home' }> = [
  { id: 'site', label: 'Terreno', icon: 'land' },
  { id: 'structure', label: 'Estructura', icon: 'layers' },
  { id: 'systems', label: 'Sistemas', icon: 'settings' },
  { id: 'finishes', label: 'Acabados', icon: 'home' },
]

function sceneDescription(stage: ScenarioResult['state']['sceneStage']): string {
  if (stage === 'rental') return 'Una vivienda alquilada como punto de partida, con el costo mensual visible.'
  if (stage === 'land') return 'Un terreno delimitado: el proyecto ya tiene un lugar donde comenzar.'
  if (stage === 'structure') return 'Una estructura en progreso: aparecen cimientos, columnas y muros.'
  if (stage === 'home') return 'Un hogar futuro construido por etapas.'
  return 'Una casa familiar y el espacio que puede convertirse en tu siguiente proyecto.'
}

export function HouseScene({ result, onLayerChange }: { result: ScenarioResult; onLayerChange: (layer: LayerId) => void }) {
  const titleId = useId()
  const descId = useId()
  const { state } = result
  const construction = state.sceneStage === 'land' || state.sceneStage === 'structure' || state.sceneStage === 'home'
  const rental = state.sceneStage === 'rental'
  const showSystems = state.selectedLayer === 'systems'
  const showFinishes = state.selectedLayer === 'finishes'

  return (
    <section className={`scene-panel stage-${state.sceneStage}`} aria-labelledby={titleId}>
      <div className="scene-heading">
        <div>
          <span className="eyebrow">Tu historia en marcha</span>
          <h2 id={titleId}>{result.sceneLabel}</h2>
        </div>
        <OriginBadge origin="MOCK" />
      </div>
      <div className="scene-canvas-wrap">
        <svg className="house-scene" viewBox="0 0 960 430" role="img" aria-labelledby={`${titleId}-svg ${descId}`}>
          <title id={`${titleId}-svg`}>{result.sceneLabel}</title>
          <desc id={descId}>{sceneDescription(state.sceneStage)}</desc>
          <rect width="960" height="430" fill="#eef3f1" />
          <path d="M0 236 C120 180 226 199 322 236S520 285 641 220s192-66 319-8V430H0Z" fill="#dce8e5" />
          <path d="M0 283 C137 231 241 244 344 283s196 41 287-1 196-57 329-9V430H0Z" fill="#c7d9d4" />
          <path d="M0 313 C130 285 212 306 320 326s212 11 310-20 224-22 330 6V430H0Z" fill="#789b83" />
          <path d="M0 335 C154 315 256 346 379 347s244-39 349-26 176 34 232 20V430H0Z" fill="#b7c68c" />
          <path d="M0 355 180 327l154 22 175-34 160 33 148-25 143 29v78H0Z" fill="#cf9b63" />
          <path d="M0 385h960v45H0z" fill="#b77945" />
          <path d="M0 385 170 358l153 23 186-33 143 32 170-29 138 28" fill="none" stroke="#8b5a3c" strokeWidth="3" />
          <g className="mountains" opacity=".9">
            <path d="m30 230 112-126 91 125z" fill="#9ab0ad" />
            <path d="m127 231 146-161 132 160z" fill="#7e9897" />
            <path d="m301 236 128-137 146 134z" fill="#93a9a2" />
            <path d="m468 239 150-171 161 168z" fill="#78908c" />
            <path d="m660 232 132-121 152 119z" fill="#9ab1aa" />
            <path d="m241 151 32-44 35 40-21-7zM570 119l48-51 49 47-30-9z" fill="#f9fbfb" />
          </g>
          <g className="sun" fill="#f08c00"><circle cx="850" cy="80" r="30" /><path d="M850 35v-14M850 139v-14M805 80h-14M909 80h-14M818 48l-10-10M882 112l-10-10M882 48l10-10M818 112l-10 10" stroke="#f08c00" strokeWidth="5" /></g>
          {construction && <g className="plot-lines"><path d="M98 348 248 318l158 26-153 31z" fill="#dba16c" stroke="#6a4636" strokeWidth="3" strokeDasharray="8 7" /><path d="M114 349 257 333" stroke="#fff" strokeWidth="3" strokeDasharray="10 8" /><path d="M257 333 400 345" stroke="#fff" strokeWidth="3" strokeDasharray="10 8" /><rect x="169" y="279" width="74" height="43" fill="#f08c00" stroke="#161a1d" strokeWidth="2" /><text x="182" y="296" fill="#fff" fontSize="14" fontWeight="700">TERRENO</text><text x="181" y="312" fill="#fff" fontSize="10">EN RUTA</text></g>}
          {!construction && <g className="home-illustration">
            <path d="M85 338V220l170-119 178 119v118z" fill="#f9fbfb" stroke="#161a1d" strokeWidth="4" />
            <path d="m60 220 195-143 207 143-29 24-178-119-168 119z" fill={rental ? '#d9480f' : '#2f9e44'} stroke="#161a1d" strokeWidth="4" />
            <path d="M238 338v-89h70v89" fill="#c27d4b" stroke="#161a1d" strokeWidth="4" /><path d="M112 230h46v45h-46zM341 230h46v45h-46z" fill="#7db5cb" stroke="#161a1d" strokeWidth="4" />
            <path d="M88 337h360" stroke="#161a1d" strokeWidth="6" /><path d="M115 336c-20-36-54-36-74 0M414 336c20-36 54-36 74 0" fill="none" stroke="#2f9e44" strokeWidth="10" />
            <circle cx="174" cy="303" r="18" fill="#f08c00" /><circle cx="351" cy="304" r="18" fill="#1971c2" />
            {rental && <g><rect x="113" y="157" width="122" height="32" fill="#fff" stroke="#d9480f" strokeWidth="3" /><text x="128" y="179" fill="#d9480f" fontSize="18" fontWeight="700">ALQUILER</text></g>}
          </g>}
          {construction && <g className="construction-illustration">
            <path d="M516 350V220l120-86 120 86v130z" fill="#f9fbfb" stroke="#161a1d" strokeWidth="4" />
            <path d="M500 220 636 119l137 101-20 18-117-84-116 84z" fill="#d9480f" stroke="#161a1d" strokeWidth="4" />
            <path d="M565 350v-107h73v107M686 350v-92h55v92" fill="#c27d4b" stroke="#161a1d" strokeWidth="4" />
            <path d="M535 229h74v48h-74zM663 229h58v48h-58z" fill="#7db5cb" stroke="#161a1d" strokeWidth="4" />
            {state.sceneStage === 'land' && <g className="site-tools"><path d="M768 317h80M810 275v42" stroke="#161a1d" strokeWidth="5" /><path d="m794 289 17-22 17 22" fill="#f08c00" stroke="#161a1d" strokeWidth="3" /><circle cx="860" cy="332" r="14" fill="#f08c00" /><path d="M850 332h20" stroke="#161a1d" strokeWidth="3" /></g>}
            {state.sceneStage === 'structure' && <g className="rebar"><path d="M529 220V135M551 220V120M732 220V137M753 220V123" stroke="#6a4636" strokeWidth="7" /><path d="M520 224h250" stroke="#6a4636" strokeWidth="8" /><path d="M521 295h247" stroke="#b77945" strokeWidth="24" opacity=".8" /></g>}
            {state.sceneStage === 'home' && <path d="M514 350h264" stroke="#2f9e44" strokeWidth="10" />}
          </g>}
          {showSystems && <g className="system-overlay"><path d="M120 365h650" stroke="#1971c2" strokeWidth="7" strokeDasharray="12 8" /><circle cx="191" cy="365" r="9" fill="#1971c2" /><circle cx="538" cy="365" r="9" fill="#1971c2" /><text x="575" y="360" fill="#1971c2" fontSize="18" fontWeight="700">AGUA + ELECTRICIDAD</text></g>}
          {showFinishes && <g className="finish-overlay"><path d="M500 370h280" stroke="#f08c00" strokeWidth="10" /><text x="580" y="399" fill="#d9480f" fontSize="18" fontWeight="700">ACABADOS</text></g>}
          <g className="scene-callout"><rect x="30" y="28" width="250" height="78" fill="#fff" stroke="#161a1d" strokeWidth="2" /><circle cx="63" cy="66" r="18" fill="#2f9e44" /><path d="M63 54v24M51 66h24" stroke="#fff" strokeWidth="3" /><text x="95" y="58" fill="#161a1d" fontSize="19" fontWeight="700">{state.housingPath ? 'Tu punto de partida' : 'Comienza aquí'}</text><text x="95" y="83" fill="#4c565d" fontSize="15">{state.housingPath ? result.sceneLabel : 'Elige una situación'}</text></g>
        </svg>
      </div>
      <p className="scene-caption"><strong>{result.sceneLabel}.</strong> {sceneDescription(state.sceneStage)} <span className="caption-note">Vista 2.5D, sin WebGL.</span></p>
      <div className="layer-rail" aria-label="Capas de la escena">
        <span className="layer-label"><Icon name="layers" size={16} /> Capas visibles</span>
        {layerLabels.map((layer) => <button className={state.selectedLayer === layer.id ? 'layer-button is-selected' : 'layer-button'} key={layer.id} onClick={() => onLayerChange(layer.id)} aria-pressed={state.selectedLayer === layer.id}><Icon name={layer.icon} size={16} />{layer.label}</button>)}
      </div>
    </section>
  )
}
