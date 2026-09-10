import type { Fuente } from './tipos'

/**
 * Registro único de fuentes. Todas las URL de este archivo se comprobaron con
 * una petición real el 2026-09-09; la que no respondió 200 no entró.
 *
 * Si una URL se rompe, se corrige aquí y se actualiza `verificadoEl`: ningún
 * módulo escribe URLs sueltas.
 */
const VERIFICADO = '2026-09-09'

function f(entidad: string, titulo: string, url: string, tipo: Fuente['tipo'], nota?: string): Fuente {
  return { entidad, titulo, url, tipo, verificadoEl: VERIFICADO, nota }
}

export const FUENTES = {
  // ---------------------------------------------------------------- registral
  sunarpEnLinea: f(
    'SUNARP',
    'Servicio de Publicidad Registral en Línea (SPRL)',
    'https://sprl.sunarp.gob.pe/',
    'OFICIAL',
    'Búsqueda y visualización de partidas. El servicio es de pago y requiere saldo.',
  ),
  sunarpServicios: f('SUNARP', 'Plataforma de servicios en línea', 'https://www.sunarp.gob.pe/serviciosenlinea/portal/index.html', 'OFICIAL'),
  sunarpCalculadora: f(
    'SUNARP',
    'Calculadora de derechos registrales',
    'https://sidciudadano.sunarp.gob.pe/PreLiquidacionWeb/Inicio',
    'OFICIAL',
    'Calcula el derecho de inscripción según el valor del acto.',
  ),
  cofopri: f('COFOPRI', 'Organismo de Formalización de la Propiedad Informal', 'https://www.gob.pe/cofopri', 'OFICIAL'),
  notarios: f('Junta de Decanos de Colegios de Notarios', 'Colegios de Notarios del Perú', 'https://www.notarios.org.pe/', 'OFICIAL'),

  // ------------------------------------------------------------------ tributos
  satLima: f(
    'SAT de Lima',
    'Servicio de Administración Tributaria de Lima',
    'https://www.gob.pe/satlima',
    'OFICIAL',
    'Alcabala y predial para predios en la provincia de Lima. Fuera de Lima, la municipalidad provincial correspondiente. El portal sat.gob.pe redirige aquí.',
  ),
  sunatEmprender: f('SUNAT', 'Regímenes tributarios para MYPE', 'https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios', 'OFICIAL'),
  sunatRegimenes: f('SUNAT', 'Regímenes tributarios (orientación)', 'https://www.gob.pe/280-superintendencia-nacional-de-aduanas-y-de-administracion-tributaria-regimenes-tributarios', 'OFICIAL'),
  sunatRmt: f('SUNAT', 'Régimen MYPE Tributario (RMT)', 'https://www.gob.pe/6990-regimen-mype-tributario-rmt', 'OFICIAL'),
  sunatRer: f('SUNAT', 'Régimen Especial de Renta (RER)', 'https://www.gob.pe/6989-declarar-y-pagar-el-impuesto-a-la-renta-de-cuarta-categoria', 'OFICIAL'),
  sunatPersonas: f('SUNAT', 'Portal Personas', 'https://personas.sunat.gob.pe/', 'OFICIAL'),
  sunatRenta: f('SUNAT', 'Renta anual de personas naturales', 'https://renta.sunat.gob.pe/personas', 'OFICIAL'),
  uit2026: f(
    'MEF',
    'Normas y documentos legales — D.S. 301-2025-EF fija la UIT 2026 en S/ 5,500',
    'https://www.gob.pe/institucion/mef/normas-legales',
    'OFICIAL',
    'Publicado el 17/12/2025. La UIT define los tramos de renta y el mínimo no imponible del Alcabala.',
  ),

  // ------------------------------------------------------------------ finanzas
  sbsTasas: f('SBS', 'Tasas de interés promedio del sistema financiero', 'https://www.sbs.gob.pe/estadisticas/tasa-de-interes/tasas-de-interes-promedio', 'REGULADO'),
  sbsHipotecario: f('SBS', 'Tasa de interés promedio — créditos hipotecarios', 'https://www.sbs.gob.pe/app/pp/EstadisticasSAEEPortal/Paginas/TIPHipotecario.aspx', 'REGULADO', 'Serie diaria por entidad. Es la referencia para no inventar una TEA.'),
  fondoMivivienda: f('Fondo MIVIVIENDA', 'Programas de crédito y bonos de vivienda', 'https://fondomivivienda.pe/', 'OFICIAL'),

  // -------------------------------------------------------------- construcción
  valoresUnitariosCap: f(
    'Colegio de Arquitectos del Perú',
    'Cuadro de Valores Unitarios Oficiales de Edificación — Costa',
    'https://cap.org.pe/valores-unitarios-oficiales-de-edificaciones/valores-unitarios-costa/',
    'OFICIAL',
    'Valores por m² desagregados en estructuras, acabados e instalaciones. Se usan para el predial, pero son la única tabla oficial por partida.',
  ),
  valoresUnitariosRm: f(
    'MVCS / El Peruano',
    'R.M. 277-2025-VIVIENDA — Valores Unitarios Oficiales de Edificación 2026',
    'https://busquedas.elperuano.pe/dispositivo/NL/2453433-1',
    'OFICIAL',
  ),
  rne: f('MVCS', 'Reglamento Nacional de Edificaciones (RNE)', 'https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne', 'OFICIAL', 'Normas E.020 cargas, E.030 sismorresistente, E.050 suelos, E.060 concreto armado, E.070 albañilería.'),
  licenciaEdificacionA: f(
    'PCM / Municipalidades',
    'Obtener licencia de edificación de modalidad A (vivienda unifamiliar)',
    'https://www.gob.pe/59133-obtener-licencia-de-edificacion-de-modalidad-a-para-la-construccion-ampliacion-y-remodelacion-de-una-vivienda-unifamiliar',
    'OFICIAL',
  ),
  licenciaModalidades: f('PCM', 'Licencia de edificación para proyectos de modalidad A', 'https://www.gob.pe/20996-obtener-licencia-de-edificacion-para-proyectos-de-la-modalidad-a', 'OFICIAL'),
  ineiPrecios: f('INEI', 'Índices de precios — materiales de construcción', 'https://www.inei.gob.pe/estadisticas/indice-tematico/precios/', 'OFICIAL', 'Para actualizar precios de materiales sin volver a cotizar todo.'),
  capeco: f('CAPECO', 'Cámara Peruana de la Construcción', 'https://www.capeco.org/', 'MERCADO'),

  // -------------------------------------------------------------- servicios
  osinergminTarifas: f(
    'Osinergmin',
    'Pliegos tarifarios de electricidad para usuario final',
    'https://www.osinergmin.gob.pe/seccion/institucional/regulacion-tarifaria/pliegos-tarifarios/electricidad/pliegos-tarifarios-usuario-final',
    'REGULADO',
    'Tarifa BT5B es la residencial típica. El pliego vigente manda sobre cualquier promedio.',
  ),
  sunass: f('SUNASS', 'Regulador de agua y saneamiento', 'https://www.gob.pe/sunass', 'REGULADO'),
  sunassPublicaciones: f('SUNASS', 'Informes y publicaciones (estudios tarifarios por EPS)', 'https://www.gob.pe/institucion/sunass/informes-publicaciones', 'REGULADO'),
  sedapal: f('SEDAPAL', 'Servicio de Agua Potable y Alcantarillado de Lima', 'https://www.sedapal.com.pe/', 'REGULADO'),

  // ------------------------------------------------------------------- salud
  minsaVacunas: f(
    'MINSA',
    'Esquema Nacional de Inmunizaciones',
    'https://www.gob.pe/22037-esquema-nacional-de-inmunizaciones',
    'OFICIAL',
    'Última actualización de la página: 31 de julio de 2026. 23 vacunas y un anticuerpo monoclonal, gratuitas en el Estado.',
  ),
  minsaCred: f('MINSA', 'Control de Crecimiento y Desarrollo (CRED) hasta los 11 años', 'https://www.gob.pe/32588-control-de-crecimiento-y-desarrollo-cred-para-menores-de-11-anos', 'OFICIAL'),
  minsaCredServicio: f('MINSA', 'Recibir Control de Crecimiento y Desarrollo (CRED)', 'https://www.gob.pe/32589-recibir-control-de-crecimiento-y-desarrollo-cred', 'OFICIAL'),
  sis: f('SIS', 'Seguro Integral de Salud', 'https://www.gob.pe/sis', 'OFICIAL', 'Cobertura estatal. El SIS Gratuito no exige aporte para población sin otro seguro.'),
  essalud: f('EsSalud', 'Seguro Social de Salud', 'https://www.gob.pe/essalud', 'OFICIAL', 'Aporte del empleador equivalente al 9 % de la remuneración.'),
  susalud: f('SUSALUD', 'Superintendencia Nacional de Salud', 'https://www.gob.pe/susalud', 'OFICIAL', 'Aquí se reclama cuando una IAFAS o IPRESS niega una cobertura.'),
  minsaPublicaciones: f('MINSA', 'Normas técnicas e informes', 'https://www.gob.pe/institucion/minsa/informes-publicaciones', 'OFICIAL'),

  // --------------------------------------------------------------- educación
  identicole: f('MINEDU', 'Identicole — buscador de colegios y pensiones declaradas', 'https://identicole.minedu.gob.pe/', 'OFICIAL', 'Permite ver pensión, cuota de ingreso y matrícula declaradas por cada colegio privado.'),
  mineduPublicaciones: f('MINEDU', 'Informes y publicaciones', 'https://www.gob.pe/institucion/minedu/informes-publicaciones', 'OFICIAL'),
  sunedu: f('SUNEDU', 'Superintendencia Nacional de Educación Superior Universitaria', 'https://www.gob.pe/sunedu', 'OFICIAL', 'Verificar que la universidad tenga licencia institucional vigente.'),
  pronabec: f('PRONABEC', 'Becas y crédito educativo', 'https://www.gob.pe/pronabec', 'OFICIAL'),

  // ----------------------------------------------------------------- trabajo
  mtpe: f('MTPE', 'Ministerio de Trabajo y Promoción del Empleo', 'https://www.gob.pe/mtpe', 'OFICIAL'),
  onp: f('ONP', 'Oficina de Normalización Previsional', 'https://www.gob.pe/onp', 'OFICIAL', 'Sistema Nacional de Pensiones: aporte del 13 % de la remuneración.'),
  indecopi: f('INDECOPI', 'Defensa del consumidor y competencia', 'https://www.gob.pe/indecopi', 'OFICIAL'),
  mimp: f('MIMP', 'Ministerio de la Mujer y Poblaciones Vulnerables', 'https://www.gob.pe/mimp', 'OFICIAL', 'Línea 100 para violencia familiar y sexual.'),
} as const satisfies Record<string, Fuente>

export type FuenteKey = keyof typeof FUENTES

/** Todas las fuentes, para el índice del expediente. */
export const LISTA_FUENTES: Fuente[] = Object.values(FUENTES)
