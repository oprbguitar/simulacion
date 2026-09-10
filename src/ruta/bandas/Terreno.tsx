import { RUTAS_VIVIENDA, type RutaViviendaId, capacidadEndeudamiento, costoTotalCredito } from '../../domain/life/catalogo/vivienda'
import { modoIngreso } from '../../domain/life/catalogo/trabajo'
import type { Perfil, Proyeccion } from '../../domain/life/motor'
import { SeccionVivienda } from '../../expediente/secciones/Vivienda'
import { plata } from '../formato'
import { Banda, Cajon, Carta, Consecuencia, Ficha } from '../piezas'

/** Cada ruta de acceso a la vivienda, con la ilustración que le corresponde. */
const ARTE: Record<RutaViviendaId, { imagen: string; alt: string; color: 'oceano' | 'selva' | 'tierra' | 'ocre'; gancho: string }> = {
  terreno: {
    imagen: '/assets/path-land.webp',
    alt: 'Terreno cercado con un árbol joven y un cartel, frente al mar.',
    color: 'tierra',
    gancho: 'Compras el lote y construyes de a pocos, durante años.',
  },
  'casa-construida': {
    imagen: '/assets/path-none.webp',
    alt: 'Casa abierta que representa una vivienda por elegir.',
    color: 'ocre',
    gancho: 'Entras a vivir ya. Pagas la construcción de otro.',
  },
  departamento: {
    imagen: '/assets/path-renting.webp',
    alt: 'Edificio pequeño de departamentos en una ciudad costera.',
    color: 'oceano',
    gancho: 'Mercado formal: es donde hay crédito de verdad.',
  },
  alquiler: {
    imagen: '/assets/path-renting.webp',
    alt: 'Edificio de viviendas en alquiler.',
    color: 'oceano',
    gancho: 'Sin deuda y sin patrimonio. El costo no para nunca.',
  },
  familia: {
    imagen: '/assets/path-family.webp',
    alt: 'Familia reunida en la sala de una vivienda.',
    color: 'selva',
    gancho: 'Cero costo de vivienda. Es cuando más rápido se ahorra.',
  },
}

export function BandaTerreno({
  proyeccion,
  onCambio,
}: {
  proyeccion: Proyeccion
  onCambio: (parcial: Partial<Perfil>) => void
}) {
  const { perfil } = proyeccion
  const ruta = RUTAS_VIVIENDA.find((r) => r.id === perfil.rutaVivienda) ?? RUTAS_VIVIENDA[0]
  const compra = perfil.rutaVivienda === 'terreno' || perfil.rutaVivienda === 'casa-construida' || perfil.rutaVivienda === 'departamento'
  const modo = modoIngreso(perfil.modoIngreso)
  const neto = perfil.ingresoMensualBruto - modo.descuentoMensual(perfil.ingresoMensualBruto)
  const tope = capacidadEndeudamiento(neto, perfil.teaAnual, perfil.plazoCreditoAnios)
  const credito = costoTotalCredito(proyeccion.montoCredito, perfil.teaAnual, perfil.plazoCreditoAnios)
  const desembolso =
    (perfil.financiamiento === 'ahorro' ? proyeccion.costoTerreno : proyeccion.costoTerreno * perfil.inicialProporcion) +
    proyeccion.alcabala +
    proyeccion.gastosCierre
  const aniosDeAhorro = desembolso > 0 && neto - perfil.gastoEsencialMensual > 0 ? desembolso / ((neto - perfil.gastoEsencialMensual) * 12) : 0

  return (
    <Banda
      id="terreno"
      paso="02"
      tono="noche"
      titulo="¿Dónde vas a vivir?"
      gancho="Cinco caminos. Ninguno es el correcto: cada uno te cobra en una moneda distinta —plata, tiempo o libertad."
    >
      <div className="rt-cartas rt-cartas-5">
        {RUTAS_VIVIENDA.map((r) => (
          <Carta
            key={r.id}
            titulo={r.titulo.replace('Comprar un terreno y construir por etapas', 'Terreno y construir').replace('Comprar una casa ya construida', 'Casa ya construida').replace('Comprar un departamento en el mercado formal', 'Departamento')}
            bajada={ARTE[r.id].gancho}
            imagen={ARTE[r.id].imagen}
            alt={ARTE[r.id].alt}
            color={ARTE[r.id].color}
            elegida={perfil.rutaVivienda === r.id}
            onElegir={() => onCambio({ rutaVivienda: r.id })}
          />
        ))}
      </div>

      <Consecuencia tono="aviso">
        <strong>Lo que queda después: </strong>
        {ruta.loQueQueda}
      </Consecuencia>

      {compra ? (
        <>
          <h3 className="rt-subtitulo">Lo que pagas el día que firmas</h3>
          <div className="rt-fichas">
            <Ficha rotulo="Precio del inmueble" valor={plata(proyeccion.costoTerreno)} pie="Muévelo en el ajuste fino" />
            <Ficha
              rotulo="Alcabala"
              valor={plata(proyeccion.alcabala)}
              pie={proyeccion.alcabala === 0 ? 'No paga: las primeras 10 UIT están libres' : '3 % sobre lo que pasa de 10 UIT'}
            />
            <Ficha rotulo="Notaría, registro y trámites" valor={plata(proyeccion.gastosCierre)} pie="Entre 3 % y 5 % del valor" />
            <Ficha
              rotulo="Sale de tu bolsillo ese día"
              valor={plata(desembolso)}
              tono={desembolso > perfil.ahorroInicial ? 'malo' : 'bueno'}
              pie={
                aniosDeAhorro > 0
                  ? `${aniosDeAhorro.toFixed(1)} años de ahorrar todo lo que te sobra`
                  : 'Con lo que sobra al mes no se llega'
              }
            />
          </div>

          <h3 className="rt-subtitulo">Si lo financias con un banco</h3>
          <div className="rt-fichas">
            <Ficha rotulo="Hasta cuánto te prestarían" valor={plata(tope)} pie={`Cuota máxima ${plata(neto * 0.3)}: un tercio de lo que te queda`} />
            {proyeccion.montoCredito > 0 ? (
              <>
                <Ficha
                  rotulo="Cuota mensual"
                  valor={plata(credito.cuota)}
                  tono={credito.cuota > neto * 0.3 ? 'malo' : 'bueno'}
                  pie={credito.cuota > neto * 0.3 ? 'El banco te lo rechaza: pasa del tercio' : `${((credito.cuota / neto) * 100).toFixed(0)} % de tu ingreso neto`}
                />
                <Ficha
                  rotulo="Intereses que regalas"
                  valor={plata(credito.interes)}
                  tono="malo"
                  pie={`En ${perfil.plazoCreditoAnios} años pagas ${(credito.total / Math.max(1, proyeccion.montoCredito)).toFixed(2)} veces lo prestado`}
                />
              </>
            ) : (
              <Ficha rotulo="Estás comprando al contado" valor="Sin deuda" pie="Cambia el financiamiento en el ajuste fino" tono="bueno" />
            )}
          </div>

          <Consecuencia tono="aviso">
            La TEA no es lo que pagas. Lo que pagas es la <strong>TCEA</strong>, que además suma el seguro de desgravamen, el seguro del inmueble,
            comisiones y portes. Pídela por escrito antes de firmar.
          </Consecuencia>
        </>
      ) : (
        <Consecuencia>
          Esta ruta no tiene desembolso de compra ni deuda hipotecaria. Lo que cambia es que al final de los {perfil.horizonteAnios} años no queda un
          bien a tu nombre.
        </Consecuencia>
      )}

      <Cajon rotulo="Ver todos los trámites, requisitos y enlaces oficiales" titulo="Adquirir la propiedad">
        <SeccionVivienda proyeccion={proyeccion} />
      </Cajon>
    </Banda>
  )
}
