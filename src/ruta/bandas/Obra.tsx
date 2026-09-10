import { useState } from 'react'
import { motion } from 'motion/react'
import { FASES_OBRA } from '../../domain/life/catalogo/construccion'
import { planDeEtapas, type Perfil, type Proyeccion } from '../../domain/life/motor'
import { SeccionConstruccion } from '../../expediente/secciones/Construccion'
import { springs } from '../../motion/tokens'
import { plata } from '../formato'
import { Banda, Bulto, Cajon, Carta, Consecuencia, Ficha } from '../piezas'

const ACABADOS: { id: Perfil['nivelAcabado']; titulo: string; bajada: string; color: 'selva' | 'oceano' | 'ocre' }[] = [
  { id: 'basico', titulo: 'Básico', bajada: 'Cemento pulido, puertas simples, sin enchapes.', color: 'selva' },
  { id: 'medio', titulo: 'Medio', bajada: 'Cerámico, melamina, aparatos de gama media.', color: 'oceano' },
  { id: 'alto', titulo: 'Alto', bajada: 'Porcelanato, carpintería a medida, griferías caras.', color: 'ocre' },
]

const AREAS = [40, 60, 90, 120, 160]

export function BandaObra({
  proyeccion,
  onCambio,
}: {
  proyeccion: Proyeccion
  onCambio: (parcial: Partial<Perfil>) => void
}) {
  const { perfil, costoObra, materiales } = proyeccion
  const [faseVista, setFaseVista] = useState(0)
  const etapas = planDeEtapas(perfil)
  const areaTotal = perfil.areaTechada * Math.max(1, perfil.pisos)
  const porAnio = costoObra.tipico / Math.max(1, perfil.duracionObraAnios)
  const porMes = porAnio / 12
  const fase = FASES_OBRA[faseVista]
  const etapa = etapas[faseVista]

  return (
    <Banda
      id="obra"
      paso="03"
      tono="tierra"
      titulo="Construir de a pocos"
      gancho="Nadie levanta una casa de golpe. Se hace por etapas, y la etapa que puedes pagar este año decide cuántos años te va a tomar."
      ilustracion="/assets/action-build.webp"
      ilustracionAlt="Albañil levantando un muro de ladrillo sobre una losa con columnas de acero."
    >
      <h3 className="rt-subtitulo">¿De qué tamaño?</h3>
      <div className="rt-chips" role="group" aria-label="Área techada por piso">
        {AREAS.map((area) => (
          <motion.button
            key={area}
            type="button"
            className={perfil.areaTechada === area ? 'rt-chip es-on' : 'rt-chip'}
            aria-pressed={perfil.areaTechada === area}
            onClick={() => onCambio({ areaTechada: area })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={springs.snap}
          >
            <strong>{area} m²</strong>
            <small>
              {area <= 40 ? 'Un ambiente y servicios' : area <= 60 ? 'Dos dormitorios' : area <= 90 ? 'Tres dormitorios' : area <= 120 ? 'Cuatro dormitorios' : 'Casa grande'}
            </small>
          </motion.button>
        ))}
      </div>

      <h3 className="rt-subtitulo">¿Con qué acabados?</h3>
      <div className="rt-cartas rt-cartas-3">
        {ACABADOS.map((acabado) => (
          <Carta
            key={acabado.id}
            titulo={acabado.titulo}
            bajada={acabado.bajada}
            compacta
            color={acabado.color}
            elegida={perfil.nivelAcabado === acabado.id}
            onElegir={() => onCambio({ nivelAcabado: acabado.id })}
          />
        ))}
      </div>

      <div className="rt-palanca">
        <label htmlFor="rt-duracion">
          <strong>¿En cuántos años la construyes?</strong>
          <small>Esta es la palanca de verdad: más años, menos presión cada mes, pero más tiempo con la obra abierta.</small>
        </label>
        <div className="rt-palanca-control">
          <input
            id="rt-duracion"
            type="range"
            min={1}
            max={20}
            value={perfil.duracionObraAnios}
            onChange={(evento) => onCambio({ duracionObraAnios: Number(evento.target.value) })}
          />
          <output>
            <strong>{perfil.duracionObraAnios}</strong>
            <span>{perfil.duracionObraAnios === 1 ? 'año' : 'años'}</span>
          </output>
        </div>
      </div>

      <div className="rt-fichas">
        <Ficha rotulo={`Construir ${areaTotal} m² te cuesta`} valor={plata(costoObra.tipico)} pie={`Entre ${plata(costoObra.min)} y ${plata(costoObra.max)}`} />
        <Ficha rotulo="Por metro cuadrado" valor={plata(costoObra.tipico / Math.max(1, areaTotal))} pie="Materiales, mano de obra e indirectos" />
        <Ficha
          rotulo="Tendrías que juntar al mes"
          valor={plata(porMes)}
          tono={porMes > (perfil.ingresoMensualBruto - perfil.gastoEsencialMensual) ? 'malo' : 'bueno'}
          pie={
            porMes > perfil.ingresoMensualBruto - perfil.gastoEsencialMensual
              ? 'Más de lo que te sobra: la obra se va a detener'
              : `${plata(porAnio)} cada año durante ${perfil.duracionObraAnios}`
          }
        />
      </div>

      <h3 className="rt-subtitulo">Las diez etapas</h3>
      <p className="rt-parrafo">Toca una para ver qué pasa ahí, cuánto pesa en el presupuesto y en qué año de tu ruta caería.</p>

      <div className="rt-obra" role="group" aria-label="Etapas de la obra">
        {FASES_OBRA.map((f, indice) => (
          <motion.button
            key={f.id}
            type="button"
            className={indice === faseVista ? 'rt-obra-etapa es-on' : 'rt-obra-etapa'}
            style={{ flexGrow: Math.max(1, f.participacion * 100) }}
            onClick={() => setFaseVista(indice)}
            aria-pressed={indice === faseVista}
            aria-label={`${f.nombre}: ${Math.round(f.participacion * 100)} % del costo`}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={springs.snap}
          >
            <span className="rt-obra-num">{indice + 1}</span>
            <span className="rt-obra-pct">{Math.round(f.participacion * 100)}%</span>
          </motion.button>
        ))}
      </div>

      <motion.div key={fase.id} className="rt-etapa-detalle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={springs.smooth}>
        <div>
          <span className="rt-etapa-rotulo">
            Etapa {faseVista + 1} de 10 · caería en el año {etapa?.anio ?? '—'}
          </span>
          <h4>{fase.nombre}</h4>
          <p>{fase.resumen}</p>
          {fase.advertencias.length > 0 ? <p className="rt-ojo">⚠ {fase.advertencias[0]}</p> : null}
        </div>
        <div className="rt-etapa-cifra">
          <strong>{plata(etapa?.costo ?? 0)}</strong>
          <span>{Math.round(fase.participacion * 100)} % del total</span>
        </div>
      </motion.div>

      <h3 className="rt-subtitulo">Lo que tienes que comprar para {areaTotal} m²</h3>
      <ul className="rt-bultos">
        {materiales.map((material, indice) => (
          <Bulto
            key={material.material}
            indice={indice}
            cantidad={material.cantidad.toLocaleString('es-PE')}
            unidad={material.unidad}
            material={material.material.replace(' (bolsas de 42.5 kg)', '').replace('Ladrillo de techo 15 × 30 × 30', 'Ladrillo de techo')}
          />
        ))}
      </ul>
      <Consecuencia>
        Estas cantidades salen de metrados: constantes de ingeniería que no se mueven con la inflación. Lo que sí se mueve es el precio —por eso en el
        detalle cada material trae el enlace para verificarlo el día que vayas a comprar.
      </Consecuencia>

      <Cajon rotulo="Ver metrados, dosificaciones, precios y licencias" titulo="Construir">
        <SeccionConstruccion proyeccion={proyeccion} />
      </Cajon>
    </Banda>
  )
}
