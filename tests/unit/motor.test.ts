import { describe, expect, it } from 'vitest'
import { PERFIL_INICIAL, costoConstruccion, planDeEtapas, proyectar, type Perfil } from '../../src/domain/life/motor'
import { FASES_OBRA, costoDirectoPorM2, metradoParaArea } from '../../src/domain/life/catalogo/construccion'
import { UIT, calcularAlcabala, capacidadEndeudamiento, costoTotalCredito, cuotaMensual } from '../../src/domain/life/catalogo/vivienda'
import { impuestoRentaTrabajo } from '../../src/domain/life/catalogo/trabajo'
import { ESQUEMA_VACUNACION, costoEsquemaPrivado } from '../../src/domain/life/catalogo/familia'
import { LISTA_FUENTES } from '../../src/domain/life/fuentes'

const perfil = (parcial: Partial<Perfil> = {}): Perfil => ({ ...PERFIL_INICIAL, ...parcial })

describe('crédito hipotecario', () => {
  it('calcula la cuota francesa a partir de la TEA', () => {
    // 100 000 a 8.4 % TEA en 20 años: la cuota está en el orden de 830-870.
    const cuota = cuotaMensual(100_000, 8.4, 20)
    expect(cuota).toBeGreaterThan(800)
    expect(cuota).toBeLessThan(900)
  })

  it('devuelve cero cuando no hay monto o no hay plazo', () => {
    expect(cuotaMensual(0, 8, 20)).toBe(0)
    expect(cuotaMensual(100_000, 8, 0)).toBe(0)
  })

  it('reparte el capital sin intereses cuando la tasa es cero', () => {
    expect(cuotaMensual(120_000, 0, 10)).toBeCloseTo(1000, 5)
  })

  it('a más plazo, menos cuota y más interés total', () => {
    const corto = costoTotalCredito(200_000, 8.4, 10)
    const largo = costoTotalCredito(200_000, 8.4, 25)
    expect(largo.cuota).toBeLessThan(corto.cuota)
    expect(largo.interes).toBeGreaterThan(corto.interes)
  })

  it('la capacidad de endeudamiento es coherente con la cuota que produce', () => {
    const maximo = capacidadEndeudamiento(3000, 8.4, 20)
    expect(cuotaMensual(maximo, 8.4, 20)).toBeCloseTo(900, 0)
  })
})

describe('impuesto de alcabala', () => {
  it('no grava las primeras 10 UIT', () => {
    expect(calcularAlcabala(10 * UIT)).toBe(0)
    expect(calcularAlcabala(45_000)).toBe(0)
  })

  it('grava el exceso al 3 %', () => {
    expect(calcularAlcabala(10 * UIT + 100_000)).toBeCloseTo(3000, 5)
  })
})

describe('impuesto a la renta de trabajo', () => {
  it('no cobra nada por debajo de la deducción de 7 UIT', () => {
    expect(impuestoRentaTrabajo(7 * UIT)).toBe(0)
    expect(impuestoRentaTrabajo(20_000)).toBe(0)
  })

  it('aplica 8 % al primer tramo de 5 UIT', () => {
    expect(impuestoRentaTrabajo(12 * UIT)).toBeCloseTo(5 * UIT * 0.08, 5)
  })

  it('es progresivo: el segundo tramo paga más por sol', () => {
    const primero = impuestoRentaTrabajo(12 * UIT)
    const segundo = impuestoRentaTrabajo(13 * UIT)
    expect(segundo - primero).toBeCloseTo(UIT * 0.14, 5)
  })
})

describe('metrados de obra', () => {
  it('escala linealmente con el área y los pisos', () => {
    const unPiso = metradoParaArea(100, 1)
    const dosPisos = metradoParaArea(100, 2)
    const cemento1 = unPiso.find((m) => m.material.startsWith('Cemento'))?.cantidad ?? 0
    const cemento2 = dosPisos.find((m) => m.material.startsWith('Cemento'))?.cantidad ?? 0
    expect(cemento2 / cemento1).toBeCloseTo(2, 1)
  })

  it('mantiene el consumo de cemento en el orden esperado por m²', () => {
    const cemento = metradoParaArea(100, 1).find((m) => m.material.startsWith('Cemento'))?.cantidad ?? 0
    // Casco más tarrajeo: entre 3.5 y 5.5 bolsas por m² techado.
    expect(cemento / 100).toBeGreaterThan(3.5)
    expect(cemento / 100).toBeLessThan(5.5)
  })

  it('no produce cantidades negativas con entradas absurdas', () => {
    for (const item of metradoParaArea(-50, 0)) expect(item.cantidad).toBeGreaterThanOrEqual(0)
  })
})

describe('costo de construcción', () => {
  it('las participaciones de las fases suman uno', () => {
    const suma = FASES_OBRA.reduce((s, f) => s + f.participacion, 0)
    expect(suma).toBeCloseTo(1, 2)
  })

  it('el rango por m² está ordenado', () => {
    const rango = costoDirectoPorM2()
    expect(rango.min).toBeLessThan(rango.tipico)
    expect(rango.tipico).toBeLessThan(rango.max)
  })

  it('el acabado alto cuesta más que el básico', () => {
    const basico = costoConstruccion(perfil({ nivelAcabado: 'basico' })).tipico
    const alto = costoConstruccion(perfil({ nivelAcabado: 'alto' })).tipico
    expect(alto).toBeGreaterThan(basico)
  })

  it('construir en selva cuesta más que en la costa', () => {
    expect(costoConstruccion(perfil({ region: 'selva' })).tipico).toBeGreaterThan(costoConstruccion(perfil({ region: 'costa' })).tipico)
  })

  it('reparte las diez fases dentro de la duración declarada', () => {
    const etapas = planDeEtapas(perfil({ anioInicioObra: 4, duracionObraAnios: 8 }))
    expect(etapas).toHaveLength(FASES_OBRA.length)
    for (const etapa of etapas) {
      expect(etapa.anio).toBeGreaterThanOrEqual(4)
      expect(etapa.anio).toBeLessThanOrEqual(12)
    }
  })
})

describe('proyección', () => {
  it('produce un año por cada año del horizonte', () => {
    expect(proyectar(perfil({ horizonteAnios: 10 })).anios).toHaveLength(10)
    expect(proyectar(perfil({ horizonteAnios: 30 })).anios).toHaveLength(30)
  })

  it('es determinista', () => {
    const a = proyectar(perfil())
    const b = proyectar(perfil())
    expect(a.anios).toEqual(b.anios)
  })

  it('coloca el desembolso de la compra en el año elegido y solo una vez', () => {
    const p = proyectar(perfil({ anioCompra: 5, financiamiento: 'ahorro' }))
    const conCompra = p.anios.filter((a) => a.eventos.some((e) => e.tipo === 'vivienda' && e.titulo.includes('contado')))
    expect(conCompra).toHaveLength(1)
    expect(conCompra[0].anio).toBe(5)
  })

  it('no descuenta el desembolso dos veces del ahorro', () => {
    const sinCompra = proyectar(perfil({ rutaVivienda: 'familia', hijos: [], anioInicioObra: 99 }))
    const conCompra = proyectar(perfil({ rutaVivienda: 'terreno', hijos: [], anioInicioObra: 99, anioCompra: 2, financiamiento: 'ahorro' }))
    const diferencia = sinCompra.anios[3].ahorroAcumulado - conCompra.anios[3].ahorroAcumulado
    const desembolso = conCompra.costoTerreno + conCompra.alcabala + conCompra.gastosCierre
    // La diferencia debe explicarse por el desembolso y el alojamiento, no por el doble.
    expect(diferencia).toBeLessThan(desembolso * 1.3)
    expect(diferencia).toBeGreaterThan(desembolso * 0.8)
  })

  it('amortiza el crédito hasta cancelarlo dentro del plazo', () => {
    const p = proyectar(perfil({ financiamiento: 'hipotecario', precioInmueble: 200_000, plazoCreditoAnios: 15, anioCompra: 0, horizonteAnios: 30 }))
    expect(p.montoCredito).toBeGreaterThan(0)
    expect(p.anios[1].deudaPendiente).toBeGreaterThan(0)
    expect(p.anios[16].deudaPendiente).toBe(0)
    expect(p.anios.some((a) => a.eventos.some((e) => e.titulo === 'Crédito cancelado'))).toBe(true)
  })

  it('no cobra servicios del hogar mientras se vive con la familia', () => {
    const p = proyectar(perfil({ rutaVivienda: 'familia', anioInicioObra: 99 }))
    expect(p.anios.every((a) => a.gastoServiciosAnual === 0)).toBe(true)
  })

  it('activar un imprevisto empeora el resultado, nunca lo mejora', () => {
    const base = proyectar(perfil())
    const golpeado = proyectar(perfil({ imprevistosActivos: ['desempleo', 'enfermedad-grave'] }))
    expect(golpeado.anios.at(-1)!.patrimonio).toBeLessThan(base.anios.at(-1)!.patrimonio)
  })

  it('avisa cuando la cuota supera un tercio del ingreso neto', () => {
    const p = proyectar(perfil({ financiamiento: 'hipotecario', precioInmueble: 500_000, ingresoMensualBruto: 3000 }))
    expect(p.alertas.map((a) => a.id)).toContain('CUOTA_SOBRE_TERCIO')
  })

  it('avisa cuando el plan se queda sin fondos', () => {
    const p = proyectar(perfil({ ingresoMensualBruto: 1200, gastoEsencialMensual: 1500 }))
    expect(p.alertas.map((a) => a.id)).toContain('AHORRO_NEGATIVO')
  })

  it('un hogar sin obra, sin hijos y con superávit no dispara alertas críticas', () => {
    const p = proyectar(
      perfil({
        rutaVivienda: 'familia',
        hijos: [],
        anioInicioObra: 99,
        anioCompra: 99,
        ingresoMensualBruto: 9000,
        gastoEsencialMensual: 2500,
        ahorroInicial: 60_000,
        financiamiento: 'ahorro',
      }),
    )
    expect(p.alertas.filter((a) => a.severidad === 'critica')).toHaveLength(0)
  })

  it('los gastos de educación aparecen cuando el hijo entra a inicial', () => {
    const p = proyectar(perfil({ hijos: [{ id: 'h', anioNacimiento: 0, educacion: 'privada', saludPrivada: false }], horizonteAnios: 20 }))
    expect(p.anios[2].gastoEducacionAnual).toBe(0)
    expect(p.anios[3].gastoEducacionAnual).toBeGreaterThan(0)
  })
})

describe('esquema de vacunación', () => {
  it('transcribe el esquema pediátrico completo con dosis y edad', () => {
    expect(ESQUEMA_VACUNACION.length).toBeGreaterThanOrEqual(28)
    for (const v of ESQUEMA_VACUNACION) {
      expect(v.vacuna.length).toBeGreaterThan(2)
      expect(v.protegeDe.length).toBeGreaterThan(4)
      expect(v.mes).toBeGreaterThanOrEqual(0)
    }
  })

  it('está ordenado por edad', () => {
    const meses = ESQUEMA_VACUNACION.map((v) => v.mes)
    expect([...meses].sort((a, b) => a - b)).toEqual(meses)
  })

  it('el costo del esquema en el sector privado tiene rango ordenado', () => {
    const c = costoEsquemaPrivado()
    expect(c.min).toBeLessThan(c.tipico)
    expect(c.tipico).toBeLessThan(c.max)
  })
})

describe('registro de fuentes', () => {
  it('toda fuente tiene entidad, título, URL https y fecha de verificación', () => {
    for (const f of LISTA_FUENTES) {
      expect(f.entidad).toBeTruthy()
      expect(f.titulo).toBeTruthy()
      expect(f.url.startsWith('https://')).toBe(true)
      expect(f.verificadoEl).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('no repite URLs con títulos distintos por descuido', () => {
    const vistos = new Map<string, string>()
    for (const f of LISTA_FUENTES) {
      const anterior = vistos.get(f.url)
      if (anterior) expect(anterior).toBe(f.titulo)
      vistos.set(f.url, f.titulo)
    }
  })
})

describe('educación', () => {
  it('la vía privada cuesta más que la pública en toda la escolaridad', async () => {
    const { costoEscolaridadCompleta } = await import('../../src/domain/life/catalogo/educacion')
    const publica = costoEscolaridadCompleta(false)
    const privada = costoEscolaridadCompleta(true)
    expect(publica.tipico).toBeGreaterThan(0) // la pública tampoco es gratis del todo
    expect(privada.tipico).toBeGreaterThan(publica.tipico * 2)
    expect(publica.min).toBeLessThan(publica.max)
  })

  it('los niveles cubren de los 3 a los 16 años sin huecos', async () => {
    const { NIVELES_EDUCATIVOS } = await import('../../src/domain/life/catalogo/educacion')
    const escolares = NIVELES_EDUCATIVOS.filter((n) => n.id !== 'superior')
    let siguiente = escolares[0].edadInicio
    for (const nivel of escolares) {
      expect(nivel.edadInicio).toBe(siguiente)
      siguiente = nivel.edadInicio + nivel.aniosDuracion
    }
    expect(siguiente).toBe(17)
  })
})

describe('modos de ingreso', () => {
  it('ningún modo descuenta más de lo que se gana', async () => {
    const { MODOS_INGRESO } = await import('../../src/domain/life/catalogo/trabajo')
    for (const modo of MODOS_INGRESO) {
      for (const bruto of [1200, 4000, 12_000]) {
        const descuento = modo.descuentoMensual(bruto)
        expect(descuento).toBeGreaterThanOrEqual(0)
        expect(descuento).toBeLessThan(bruto)
      }
    }
  })

  it('el independiente no paga renta mientras no supere la deducción de 7 UIT', async () => {
    const { modoIngreso } = await import('../../src/domain/life/catalogo/trabajo')
    // 4 000 al mes son 48 000 al año; menos el 20 % quedan 38 400, por debajo de 7 UIT.
    expect(modoIngreso('independiente').descuentoMensual(4000)).toBe(0)
    expect(modoIngreso('independiente').descuentoMensual(12_000)).toBeGreaterThan(0)
  })

  it('la planilla descuenta más que el recibo por honorarios al mismo bruto', async () => {
    const { modoIngreso } = await import('../../src/domain/life/catalogo/trabajo')
    expect(modoIngreso('dependiente').descuentoMensual(5000)).toBeGreaterThan(modoIngreso('independiente').descuentoMensual(5000))
  })
})

describe('imprevistos', () => {
  it('cada imprevisto trae al menos una vía institucional', async () => {
    const { IMPREVISTOS } = await import('../../src/domain/life/catalogo/imprevistos')
    for (const ev of IMPREVISTOS) {
      expect(ev.mitigacion.length).toBeGreaterThan(0)
      expect(ev.fuentes.length).toBeGreaterThan(0)
      expect(ev.probabilidadAnual).toBeGreaterThan(0)
      expect(ev.probabilidadAnual).toBeLessThanOrEqual(1)
    }
  })
})
