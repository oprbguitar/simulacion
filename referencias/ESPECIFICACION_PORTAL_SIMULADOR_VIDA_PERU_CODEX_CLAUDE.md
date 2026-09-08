# ESPECIFICACIÓN MAESTRA — PORTAL LÚDICO DE SIMULACIÓN DE VIDA Y VIVIENDA EN PERÚ

**Versión:** 0.1 — Prototipo funcional  
**Fecha de referencia:** septiembre de 2026  
**Idioma del producto:** español (Perú)  
**Objetivo de este documento:** servir como especificación técnica, funcional y de producto para Codex, Claude u otro agente de desarrollo.

---

## 1. Visión del producto

Construir un portal web interactivo que permita a una persona simular decisiones reales de vida en Perú sin sentirse frente a un formulario financiero, un ERP o un expediente técnico.

La aplicación debe funcionar como una mezcla de:

- simulador de proyecto de vida;
- juego de decisiones no competitivo;
- calculadora financiera y patrimonial;
- orientador de vivienda, alquiler y construcción;
- timeline vital interactivo;
- visualizador 2D/2.5D/3D de una vivienda;
- motor de escenarios y pruebas de estrés;
- agregador trazable de datos oficiales, comerciales y comunitarios.

La aplicación **no debe decidir por el usuario**. Debe permitirle comparar caminos y mostrar las consecuencias de los supuestos elegidos.

### Idea central

> “Muéstrame dónde estoy hoy, qué quiero lograr, qué caminos tengo, cuánto podría costar, cuánto podría tardar y qué podría pasar si la vida no sale exactamente como la planeé.”

El resultado no es un “final de vida” ni una predicción. Es un **proyecto vivo**, editable y re-simulable.

---

# 2. Principios obligatorios de producto

## 2.1. Backend complejo, interfaz simple

El sistema puede manejar cientos de variables internamente, pero el usuario debe ver en cada momento solamente:

1. dónde está;
2. cuál es su siguiente decisión;
3. qué cambia si la toma;
4. cuánto dinero/tiempo implica;
5. una advertencia o sugerencia contextual cuando corresponda.

Nunca presentar 40 inputs simultáneamente.

## 2.2. Experiencia tipo gameplay, no formulario

No usar un wizard clásico “Paso 1 de 27”.

Usar:

- timeline;
- hitos;
- decisiones;
- animaciones de progreso;
- evolución de vivienda;
- tarjetas contextuales;
- eventos simulados;
- comparadores rápidos;
- transiciones visuales.

## 2.3. No convertir la aplicación en asesor médico, estructural o legal

La aplicación puede estimar costos, mostrar requisitos y advertir riesgos, pero debe separar claramente:

- cálculo económico;
- orientación informativa;
- decisión técnica profesional.

Ejemplos:

- Puede presupuestar cimentaciones, pero no dimensionar una zapata sin cálculo estructural.
- Puede mostrar el esquema oficial de inmunizaciones, pero no diagnosticar enfermedades.
- Puede estimar costos de licencia, pero debe remitir al TUPA vigente de la municipalidad correspondiente.

## 2.4. No usar falsa precisión

Nunca mostrar un presupuesto preliminar como:

`S/ 137,453.72 exactos`

si los datos dependen de acabados, metrados o cotizaciones no cerradas.

Mostrar:

- escenario económico;
- escenario probable;
- escenario conservador;
- nivel de confianza;
- fecha de los datos.

## 2.5. Toda cifra externa debe ser trazable

Cada dato externo debe guardar:

- fuente;
- URL;
- fecha de captura;
- ubicación;
- unidad;
- proveedor/entidad;
- nivel de confianza;
- método de captura;
- última actualización;
- tipo de fuente.

---

# 3. Inicio correcto de la experiencia

## 3.1. Primera pregunta

La aplicación inicia con:

> **¿Dónde vives actualmente?**

Opciones principales:

- Tengo un terreno.
- Tengo una casa.
- Tengo un departamento.
- Vivo alquilando.
- Vivo dentro del entorno familiar.
- No tengo propiedad y quiero adquirir una.
- Quiero comparar varias alternativas.

### Si vive en entorno familiar

Permitir especificar:

- con padres;
- con pareja y padres/suegros;
- con otros familiares;
- habitación propia;
- piso independiente;
- vivienda multifamiliar;
- no paga alquiler;
- aporta dinero fijo;
- paga servicios;
- paga alimentación;
- combina varios aportes.

La vivienda familiar debe considerarse una **forma de apoyo económico indirecto** si reduce gastos, pero también debe poder existir una dependencia económica hacia familiares.

---

# 4. Segunda decisión: objetivo actual

Después de conocer la situación habitacional:

> **¿Qué te gustaría intentar ahora?**

Opciones dinámicas según la situación:

- seguir viviendo allí y ahorrar;
- independizarse;
- alquilar;
- comprar departamento;
- comprar casa;
- comprar terreno;
- construir primer piso;
- construir progresivamente;
- ampliar un segundo/tercer piso;
- remodelar;
- vender;
- convertir inmueble en alquiler;
- formar familia;
- estudiar;
- emprender;
- comparar caminos;
- “todavía no sé”.

La opción “todavía no sé” debe ser válida y llevar a una comparación guiada.

---

# 5. Interfaz principal: una sola superficie de simulación

Evitar un portal con navegación profunda.

## 5.1. Composición recomendada desktop

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Ahorro S/32,500 │ Ingreso S/7,200 │ Reserva 5 meses │ Patrimonio S/ XX     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                       ESCENA / PROYECTO DE VIDA                             │
│                                                                             │
│                 [ vivienda 2.5D / 3D interactiva ]                          │
│                                                                             │
│     Contexto actual + siguiente decisión + costo aproximado                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2026 ─ 2027 ─ 2028 ─ 2029 ─ 2030 ─ 2031 ─ 2032 ─ ...                       │
│  HOY    ahorro   terreno   obra      bebé     colegio                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 💡 ¿Has pensado en esto?                                                    │
│ Después de esta etapa tu fondo cubriría solo 1.8 meses de gastos.          │
│ [Continuar] [Guardar reserva] [Comparar alternativa]                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.2. Mobile

En móvil:

- HUD superior reducido;
- escena 2.5D/3D central;
- timeline horizontal desplazable;
- bottom-sheet contextual;
- máximo 3 decisiones primarias visibles;
- panel de detalles solo al tocar “ver detalle”.

No debe existir scroll vertical interminable.

---

# 6. Bucle de gameplay

El usuario repite este ciclo:

```text
ESTADO ACTUAL
     ↓
DECISIÓN
     ↓
SIMULACIÓN
     ↓
CAMBIO VISUAL
     ↓
CAMBIO FINANCIERO
     ↓
IMPACTO EN TIMELINE
     ↓
ADVERTENCIA / OPORTUNIDAD
     ↓
SIGUIENTE DECISIÓN
```

Ejemplo:

1. Vive con sus padres.
2. Tiene S/25,000 ahorrados.
3. Escoge comprar terreno.
4. El timeline muestra cuánto tardaría en completar una inicial.
5. Compra simulada.
6. La escena cambia de “casa familiar” a “terreno”.
7. El usuario elige construir 80 m².
8. Aparecen cimientos.
9. Se recalcula la reserva.
10. La aplicación pregunta: “¿Quieres construir todo o por etapas?”.

---

# 7. Timeline como elemento principal

El timeline no es solo gráfico: es el motor de navegación.

Debe soportar:

- años y meses;
- hitos reales y simulados;
- eventos planificados;
- gastos recurrentes;
- deudas;
- inicios/fin de estudios;
- embarazo/nacimiento;
- ingreso escolar;
- construcción por etapas;
- compra de propiedad;
- cambios de trabajo;
- emprendimiento;
- emergencias simuladas.

Tipos de nodos:

- `decision`;
- `milestone`;
- `expense`;
- `income_change`;
- `construction_stage`;
- `family_event`;
- `education_event`;
- `risk_event`;
- `maintenance_event`;
- `regulatory_event`.

Cada nodo debe ser editable y reversible en la simulación.

---

# 8. Mecánica “¿Has pensado en esto?”

Crear un motor de mensajes contextuales.

Ejemplos:

> **¿Has pensado en esto?**  
> Estás usando el 95 % de tus ahorros en la cuota inicial. Probemos qué ocurriría si aparece una emergencia tres meses después.

> **¿Has pensado en esto?**  
> Estás diseñando la vivienda para un solo piso, pero indicaste que posiblemente ampliarás en el futuro. La evaluación estructural debería considerar esa posibilidad desde ahora.

> **¿Has pensado en esto?**  
> El inicio del colegio de tu hijo coincide con los años de mayor carga de tu crédito.

Regla: el mensaje debe ser corto. Los detalles se muestran bajo demanda.

---

# 9. “Modo La vida pasa” — pruebas de estrés

Debe existir un toggle:

> **Modo “La vida pasa”**

No debe afirmar que estos eventos ocurrirán. Son simulaciones de resiliencia.

Eventos configurables:

- 3, 6 o 12 meses sin empleo;
- caída temporal de ingresos de 20/30/50 %;
- enfermedad o gasto médico extraordinario;
- familiar necesita apoyo económico;
- reparación urgente de vivienda;
- aumento del costo de construcción;
- retraso de obra;
- nacimiento anticipado respecto del plan;
- incremento de alquiler;
- incremento de tasa efectiva en un nuevo financiamiento;
- pérdida parcial de inversión de emprendimiento;
- costo educativo mayor al esperado;
- inflación superior al supuesto base;
- mudanza no planificada.

El prototipo puede iniciar con eventos deterministas predefinidos. Monte Carlo queda para una fase posterior.

---

# 10. Módulo vivienda

## 10.1. Situaciones

- terreno;
- casa;
- departamento;
- alquiler;
- vivienda familiar;
- propiedad con crédito;
- propiedad heredada;
- construcción parcial;
- piso en predio familiar.

## 10.2. Compra

Variables:

- precio;
- cuota inicial;
- gastos de adquisición;
- notaría;
- registro;
- tributos aplicables;
- tasación;
- gastos bancarios;
- seguros;
- mudanza;
- adecuación inicial;
- equipamiento.

## 10.3. Alquiler

Variables:

- alquiler mensual;
- garantía;
- adelanto;
- mantenimiento;
- servicios;
- internet;
- estacionamiento;
- mudanza;
- equipamiento;
- incremento anual configurable;
- obligaciones tributarias en la vista del propietario.

## 10.4. Comparador

Comparar:

- continuar con familia;
- alquilar;
- comprar departamento;
- comprar casa;
- terreno + construcción progresiva.

No declarar un “ganador” universal. Mostrar costo acumulado, liquidez, patrimonio y resiliencia bajo los mismos supuestos.

---

# 11. Módulo construcción — modo “obra real peruana”

Este módulo debe evitar la simplificación “mano de obra: S/X”.

## 11.1. Fases mínimas

1. Situación legal del predio.
2. Estudios y levantamiento.
3. Diseño arquitectónico.
4. Ingeniería.
5. Licencia municipal.
6. Obras preliminares.
7. Movimiento de tierras.
8. Cimentación.
9. Estructura.
10. Albañilería.
11. Techo/losa.
12. Instalación sanitaria.
13. Instalación eléctrica.
14. Tarrajeo.
15. Pisos y revestimientos.
16. Puertas.
17. Ventanas.
18. Pintura.
19. Sanitarios y griferías.
20. Luminarias e interruptores.
21. Cocina/mobiliario.
22. Pruebas y seguridad.
23. Limpieza y entrega.
24. Formalización/conformidad cuando corresponda.
25. Mantenimiento futuro.

## 11.2. Mano de obra

Modalidades de contratación que el sistema debe poder representar:

- jornal diario;
- pago semanal;
- por m²;
- por metro lineal;
- por m³;
- por partida;
- maestro + cuadrilla;
- contratista por etapa;
- suma alzada;
- llave en mano.

Roles de referencia:

- maestro;
- operario;
- oficial;
- peón/ayudante;
- electricista;
- sanitario/gasfitero;
- pintor;
- carpintería/metalmecánica;
- instaladores especializados.

El sistema debe distinguir **referencias laborales formales** de **precios observados de pequeñas obras residenciales**.

## 11.3. Vaciado/llenado de techo

Crear una interacción especial:

> **Llegó el momento del techo. ¿Cómo quieres simular el vaciado?**

A. Preparación en obra.  
B. Concreto premezclado con mixer.  
C. Mixer + bomba.  
D. Servicio integral contratado.

Considerar:

- volumen especificado por el proyecto;
- concreto;
- transporte;
- cuadrilla;
- vibrado cuando corresponda;
- encofrado;
- bomba;
- acceso del mixer;
- altura;
- tiempo de descarga;
- desperdicio;
- seguridad;
- curado posterior.

No calcular dimensiones estructurales sin datos profesionales.

## 11.4. Materiales

Como mínimo:

- cemento;
- acero/fierro;
- ladrillo;
- arena;
- piedra/grava;
- concreto premezclado;
- madera/encofrado;
- tuberías y accesorios;
- cables;
- tableros;
- termomagnéticos;
- diferenciales;
- puesta a tierra;
- cajas y tomacorrientes;
- pintura;
- imprimante/sellador;
- masilla;
- cerámica/porcelanato;
- puertas;
- ventanas;
- vidrio;
- sanitarios;
- griferías;
- luminarias;
- muebles.

Para cada producto guardar unidad comparable: kg, bolsa, m, m², m³, unidad, galón, etc.

---

# 12. Instalación eléctrica y seguridad

La calculadora debe separar:

- tablero;
- alimentadores;
- circuitos;
- cableado;
- canalización;
- interruptores;
- tomacorrientes;
- luminarias;
- termomagnéticos;
- interruptores diferenciales;
- puesta a tierra;
- protección de cargas especiales;
- terma;
- cocina eléctrica;
- bombas;
- aire acondicionado;
- reserva para ampliación.

Debe existir una calculadora de **demanda estimada** para orientación económica, pero cualquier cambio de suministro o dimensionamiento debe quedar sujeto a evaluación técnica y empresa distribuidora.

---

# 13. Módulo familia

El timeline familiar debe poder incorporar:

- embarazo;
- nacimiento;
- 0–6 meses;
- 6–12 meses;
- 1–2 años;
- primera infancia;
- inicial;
- primaria;
- secundaria;
- instituto/universidad.

Costos configurables:

- controles;
- parto público/asegurado/privado como escenarios económicos;
- vacunación oficial;
- consultas privadas complementarias;
- alimentación;
- fórmula si corresponde;
- pañales;
- ropa;
- seguros;
- medicamentos contingentes;
- guardería/cuidado;
- colegio;
- movilidad;
- tecnología;
- educación superior.

No generar diagnósticos genéticos. Antecedentes familiares solo deben disparar sugerencias para consultar profesionales y, opcionalmente, reservar un presupuesto de evaluación.

---

# 14. Apoyo y dependencia familiar

Variables independientes:

## Apoyo recibido

- alojamiento;
- dinero;
- alimentación;
- cuidado de hijos;
- transporte;
- otros.

## Apoyo entregado

- padres;
- abuelos;
- hijos;
- hermanos;
- otros familiares.

El sistema puede monetizar el alojamiento evitado como **costo no desembolsado**, pero debe identificarlo como estimación, no como ingreso real.

---

# 15. Educación y mercado laboral

No usar la premisa “estudia X = ganarás Y”.

Calcular:

- costo total de estudios;
- duración;
- ingresos dejados de percibir;
- rango salarial observado;
- incertidumbre;
- tiempo aproximado de recuperación de inversión bajo diferentes escenarios;
- periodo de búsqueda de empleo;
- subempleo posible;
- cambio de carrera.

Escenarios:

- favorable;
- base;
- adverso.

---

# 16. Emprendimiento

Variables mínimas:

- capital inicial;
- inventario;
- herramientas/equipos;
- alquiler;
- servicios;
- publicidad;
- tributos;
- capital de trabajo;
- sueldo del propietario;
- ventas;
- margen;
- estacionalidad;
- periodo sin ingresos;
- punto de equilibrio.

Escenarios del prototipo:

- negocio no genera ingresos por 3 meses;
- negocio cubre costos;
- negocio genera 50 % del ingreso laboral anterior;
- negocio alcanza ingreso objetivo después de N meses.

No asumir que el negocio siempre crece.

---

# 17. Motor matemático

El LLM nunca debe calcular directamente las cifras centrales.

Usar funciones deterministas.

## 17.1. Flujo de caja

```text
flujo(t) = ingresos(t)
         - vivienda(t)
         - gastos_familia(t)
         - servicios(t)
         - deuda(t)
         - educación(t)
         - salud(t)
         - construcción(t)
         - eventos_extraordinarios(t)
```

## 17.2. Patrimonio

```text
patrimonio(t) = activos(t) - obligaciones(t)
```

## 17.3. Reserva

```text
meses_reserva = liquidez_disponible / gasto_mensual_esencial
```

## 17.4. Hipoteca

Usar fórmula de anualidad para una primera aproximación y modelos que permitan incorporar seguros/comisiones por separado.

```text
cuota = P * [r(1+r)^n] / [(1+r)^n - 1]
```

Comparar TCEA cuando exista información disponible.

## 17.5. Construcción

```text
costo_partida = metrado × precio_unitario
```

```text
precio_unitario = material + mano_obra + equipo + transporte + desperdicio
```

## 17.6. Rango de incertidumbre

No inventar una distribución estadística en el MVP.

Usar inicialmente:

```text
económico   = base × factor_bajo
probable    = base
conservador = base × factor_alto
```

Los factores deben depender del tipo de partida y del nivel de confianza de la fuente, no ser globales y arbitrarios.

---

# 18. Tipología de fuentes

Crear niveles:

### A — Oficial

Norma, dataset público o regulador.

### B — Sectorial/proveedor primario

Fabricantes, proveedores o entidades especializadas.

### C — Mercado observado

Retail, portales inmobiliarios, aseguradoras, clínicas, colegios, etc.

### D — Cotización

Cotización real ingresada por usuario/proveedor.

### E — Comunidad

Foros, redes, grupos, comentarios, referencias de usuarios.

Nunca mezclar A y E sin indicarlo.

---

# 19. Fuentes de datos recomendadas para Perú

> **Regla de implementación:** preferir API, CSV, XLSX, RSS o descarga oficial. Usar scraping únicamente cuando no exista alternativa estructurada y cuando los términos de uso y acceso público lo permitan. No evadir CAPTCHA, autenticación, bloqueos ni restricciones técnicas.

## 19.1. Construcción y normativa

### MVCS — Reglamento Nacional de Edificaciones

Uso:

- normas de vivienda;
- estructuras;
- suelos;
- concreto;
- albañilería;
- sanitarias;
- electricidad;
- seguridad.

Fuente:

https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamentonacional-de-edificaciones-rne

Fuente complementaria de actualizaciones RNE — SENCICO:

https://www.gob.pe/institucion/sencico/informes-publicaciones/%20887225-normas-del-reglamento-nacional-de-edificaciones-rne

Importante: la modificación de E.030 Diseño Sismorresistente fue actualizada en 2026; el sistema debe guardar versión y fecha de vigencia.

## 19.2. Índices de precios de construcción

### INEI

Usar:

- Índice de Precios de Materiales de Construcción de Lima Metropolitana;
- Índices Unificados de Precios de la Construcción;
- series históricas.

Punto de entrada:

https://www.inei.gob.pe/buscador/1/?tbusqueda=precios+de+construccion

Los índices sirven para **actualización temporal y análisis de tendencia**, no para reemplazar precios minoristas específicos.

## 19.3. Materiales y retail

Fuentes candidatas:

- Promart;
- Sodimac;
- Maestro;
- Aceros Arequipa;
- fabricantes y distribuidores especializados;
- proveedores de concreto premezclado.

Método:

1. revisar API/feeds/datos estructurados;
2. si no existe, crawler de páginas públicas;
3. normalizar producto/unidad;
4. guardar snapshot;
5. detectar cambios;
6. no depender de un único comercio.

Campos:

```text
sku
nombre
marca
categoria
unidad
cantidad_unidad
precio
precio_unitario
stock
proveedor
ubicacion
flete
url
capturado_en
```

## 19.4. Créditos e hipotecas

### SBS — comparación de créditos

https://www.sbs.gob.pe/usuarios/informate-y-compara/compara-productos-financieros/compara-costos-de-creditos

Uso:

- tasas;
- comparación de productos;
- educación sobre TCEA;
- referencias hipotecarias.

La simulación hipotecaria debe ser propia y reproducible.

## 19.5. SUNARP

Usar información oficial sobre:

- inscripción;
- compraventa;
- derechos registrales;
- consulta registral;
- calculadora registral cuando sea accesible.

Punto de referencia de calculadora:

https://www.sunarp.gob.pe/Calculadora/index.asp

No automatizar servicios que requieran sesión o pago sin autorización.

## 19.6. SUNAT — alquiler

### Rentas de primera categoría

https://personas.sunat.gob.pe/alquilo-mi-casa-o-auto/rentas-primera-categoria

Uso:

- vista propietario;
- obligaciones de renta de primera categoría;
- cambios normativos con fecha de vigencia.

## 19.7. Municipalidades

No existe una única base uniforme con todos los costos de licencia.

Crear un catálogo municipal:

```text
municipality
procedure
modality
requirement
fee
legal_basis
processing_time
source_url
valid_from
captured_at
```

Prioridad MVP:

- Lima Metropolitana;
- 3–5 municipalidades piloto;
- luego expansión.

El crawler debe vigilar TUPA y páginas de licencias, pero la interfaz siempre debe mostrar enlace oficial y fecha.

## 19.8. Electricidad

### Osinergmin — pliegos tarifarios

https://www.osinergmin.gob.pe/seccion/institucional/Paginas/VisorPliegosTarifarios.aspx

Uso:

- tarifas vigentes;
- histórico;
- estimación de consumo doméstico.

No usarlo para autorizar monofásico/trifásico; eso requiere evaluación técnica y condiciones de la distribuidora.

## 19.9. Telecomunicaciones

### OSIPTEL — Checa tu Plan

https://www.checatuplan.pe/

Portal institucional informativo:

https://www.osiptel.gob.pe/

Uso:

- planes de internet fijo;
- precios;
- cobertura/ámbito cuando se encuentre disponible;
- estimación de velocidad necesaria.

## 19.10. Mercado inmobiliario

### Urbania Index Lima

https://urbania.pe/blog/urbania-index-lima/

El índice informa que se actualiza mensualmente y presenta precios de venta, alquiler y rentabilidad por zonas/distritos.

Usarlo como **mercado observado**, no como fuente oficial.

### BCRP — indicador de departamentos

https://www.bcrp.gob.pe/estadisticas/indicador-de-precios-de-venta-de-departamentos.html

Uso:

- referencia macro/estadística;
- series comparativas;
- no reemplaza tasación.

## 19.11. Salud

### MINSA — Esquema Nacional de Inmunizaciones

Norma 2026:

https://www.gob.pe/institucion/minsa/normas-legales/8265031-561-2026-minsa

Página de orientación actualizada:

https://www.gob.pe/institucion/minsa/pages/22037-esquema-regular-de-vacunacion-por-etapas-de-vida-en-el-peru

Uso:

- timeline oficial de inmunizaciones;
- distinguir inmunizaciones públicas de opciones privadas complementarias.

### SUSALUD — RENIPRESS

https://www.datosabiertos.gob.pe/dataset/registro-nacional-de-entidades-prestadoras-de-servicios-de-salud-renipress

Dataset mensual con establecimientos públicos, privados y mixtos, ubicación, categoría y otros campos.

## 19.12. Educación escolar

### MINEDU — Datos Abiertos

https://www.datosabiertos.gob.pe/group/ministerio-de-educaci%C3%B3n-minedu

Dataset específico:

https://www.datosabiertos.gob.pe/dataset/listado-de-servicios-educativos-escolarizados

Uso:

- establecimientos;
- gestión pública/privada;
- ubicación;
- modalidad.

Los precios de colegios privados deben venir de publicaciones del propio colegio o de cotizaciones, no inferirse del dataset MINEDU.

## 19.13. Universidad

### SUNEDU — Programas académicos

https://www.datosabiertos.gob.pe/dataset/sunedu-programas-acad%C3%A9micos

Uso:

- universidades licenciadas;
- programas vigentes por local/sede;
- verificación institucional.

## 19.14. Empleo

### MTPE — Mi Carrera

https://micarrera.trabajo.gob.pe/

Uso:

- orientación laboral;
- rangos salariales observados;
- carrera/institución cuando la fuente lo permita.

No convertir remuneración histórica en salario garantizado.

## 19.15. Alimentación

### MIDAGRI — Datero Agrario

https://www.datosabiertos.gob.pe/dataset/midagri-02-datero-agrario-ministerio-de-desarrollo-agrario-y-riego

Uso:

- precios promedio de productos agropecuarios;
- mercados mayoristas;
- canastas de referencia.

Punto general MIDAGRI:

https://www.datosabiertos.gob.pe/group/ministerio-de-desarrollo-agrario-y-riego-midagri

---

# 20. Estrategia de actualización de datos

“Tiempo real” debe significar **frescura adecuada a cada dominio**.

Tabla sugerida:

| Dominio | Frecuencia inicial | Método |
|---|---:|---|
| Retail materiales | 1–2 veces/día | crawler/detección de cambios |
| Índices INEI | mensual | descarga oficial |
| Tarifas eléctricas | cuando cambia / revisión diaria ligera | monitor de fuente |
| Urbania Index | mensual | extracción/descarga |
| Datos MINEDU/SUNEDU | mensual/trimestral según publicación | dataset oficial |
| RENIPRESS | mensual | CSV oficial |
| Vacunación MINSA | monitor normativo | cambio de norma/página |
| TUPA municipal | semanal/mensual | change detection + revisión |
| SBS | semanal/mensual | consulta estructurada/captura |
| Mercado laboral | mensual/trimestral | fuente oficial |
| MIDAGRI | según dataset | CSV/servicio |

No ejecutar Playwright si un HTTP request simple o un CSV oficial resuelve el caso.

---

# 21. Pipeline de datos

```text
FUENTE
  ↓
ADAPTER / INGESTOR
  ↓
RAW SNAPSHOT
  ↓
VALIDACIÓN
  ↓
NORMALIZACIÓN
  ↓
DEDUPLICACIÓN
  ↓
CÁLCULO DE FRESCURA Y CONFIANZA
  ↓
BASE NORMALIZADA
  ↓
MOTOR DE SIMULACIÓN
  ↓
UI + CITACIÓN DE FUENTE
```

Guardar el raw snapshot antes de normalizar cuando la licencia y tamaño lo permitan.

---

# 22. Scraping y monitoreo

## Stack sugerido

### Crawlee

https://github.com/apify/crawlee

Uso:

- crawling TypeScript;
- HTTP crawler;
- Playwright crawler;
- reintentos;
- colas;
- parsing.

### Playwright

https://github.com/microsoft/playwright

Uso:

- páginas dinámicas;
- pruebas end-to-end;
- extracción cuando el HTML requiera JS.

### changedetection.io

https://github.com/dgtlmoon/changedetection.io

Uso opcional:

- detectar que una página cambió antes de ejecutar un extractor más caro;
- precios;
- TUPA;
- cambios regulatorios.

No es obligatorio integrarlo al MVP; puede reemplazarse con hashes propios de contenido.

## Reglas

- respetar términos de uso;
- respetar rate limits;
- identificar crawler cuando corresponda;
- cachear;
- no evadir controles de acceso;
- no automatizar servicios personales;
- no almacenar datos personales innecesarios.

---

# 23. Arquitectura tecnológica propuesta

## 23.1. Frontend

- Next.js;
- React;
- TypeScript;
- CSS/Tailwind o sistema equivalente con tokens propios;
- diseño responsive mobile-first.

## 23.2. Backend

Primera opción:

- Cloudflare Workers.

## 23.3. Base principal

Primera opción:

- Cloudflare D1.

D1 debe quedar detrás de una interfaz de repositorio para permitir migrar a PostgreSQL/Neon.

Nunca importar D1 directamente desde componentes UI.

## 23.4. Archivos

- Cloudflare R2 para GLB/GLTF, datasets raw, imágenes propias y exports.

## 23.5. Alternativa SQL

- Neon PostgreSQL.

Implementar:

```text
DatabaseAdapter
  ├─ D1DatabaseAdapter
  └─ PostgresDatabaseAdapter (placeholder o implementación posterior)
```

## 23.6. No usar Supabase

Supabase queda explícitamente fuera de esta propuesta inicial.

---

# 24. Visualización 3D/2.5D

## 24.1. Motor principal

### Three.js

https://github.com/mrdoob/three.js

### React Three Fiber

https://github.com/pmndrs/react-three-fiber

React Three Fiber es el renderer React sobre Three.js; no son tecnologías competidoras.

Uso:

- terreno;
- cimientos;
- columnas;
- muros;
- techo;
- instalaciones;
- acabados;
- selección de componentes;
- resaltado por etapas.

## 24.2. Fallback

### Google model-viewer

https://github.com/google/model-viewer

Uso:

- GLB ligero;
- móviles donde no convenga cargar una escena React Three Fiber completa;
- visualizador simplificado.

## 24.3. Fallback ultraligero

- SVG/2.5D isométrico;
- capas activables;
- animación con Motion.

## 24.4. BIM futuro

### web-ifc

https://github.com/ThatOpen/engine_web-ifc

Permitir en una fase posterior importar IFC y relacionar elementos BIM con partidas/metrados.

No usar el repositorio legado `web-ifc-viewer` como base principal: su propio repositorio está marcado como deprecado; usar la línea actual de componentes/engine de That Open.

---

# 25. Rendimiento gráfico

El prototipo debe priorizar fluidez sobre fotorealismo.

Objetivos iniciales sugeridos, no límites rígidos:

- escena inicial 3D: 1–5 MB si es posible;
- texturas: 1K normalmente;
- 2K solo cuando aporte valor;
- evitar sombras dinámicas múltiples;
- lazy-load del motor 3D;
- no cargar 3D para quien solo usa alquiler/finanzas;
- usar GLB;
- evaluar Draco/Meshopt;
- render on-demand cuando la escena esté quieta;
- reducir DPR/calidad en dispositivos lentos;
- fallback automático 2.5D.

El usuario debe poder activar “modo ahorro de datos”.

---

# 26. Animaciones y gráficos

## Motion

https://github.com/motiondivision/motion

Usar para:

- transiciones de layout;
- timeline;
- tarjetas;
- números que cambian;
- progresión de etapas;
- microinteracciones.

No abusar de animaciones decorativas.

## Apache ECharts

https://github.com/apache/echarts

Usar para:

- patrimonio;
- deuda;
- costo acumulado;
- composición del presupuesto;
- evolución temporal;
- Sankey opcional;
- comparaciones.

## React Flow / XYFlow

https://github.com/xyflow/xyflow

Uso secundario:

- “Ver mis caminos posibles”;
- árbol de decisiones;
- escenarios alternativos.

No mostrar el grafo como pantalla principal.

---

# 27. Estado y orquestación

## XState

https://github.com/statelyai/xstate

Usar para decisiones complejas:

```text
living_with_family
  → saving
  → evaluating_land
  → land_acquired
  → design
  → construction
  → first_floor_complete
```

No usar XState para cada checkbox. Reservarlo para flujos y estados de dominio.

---

# 28. Modelo de datos mínimo

Tablas/colecciones lógicas:

```text
users
profiles
households
household_members
projects
scenarios
scenario_assumptions
incomes
expenses
debts
assets
properties
property_market_observations
construction_projects
construction_stages
construction_items
construction_estimates
labor_roles
labor_rate_observations
products
suppliers
price_observations
municipalities
municipal_procedures
education_entities
education_cost_observations
health_entities
health_cost_observations
career_observations
food_price_observations
risk_events
timeline_events
maintenance_events
sources
source_snapshots
source_fetch_runs
source_quality_scores
```

---

# 29. Esquema de trazabilidad

Ejemplo conceptual:

```json
{
  "value": 31.50,
  "currency": "PEN",
  "unit": "bag_42_5kg",
  "sourceType": "market_retail",
  "sourceName": "Proveedor X",
  "sourceUrl": "https://...",
  "location": "Lima",
  "capturedAt": "2026-09-07T14:33:00-05:00",
  "freshness": "fresh",
  "confidence": 0.82,
  "method": "crawler"
}
```

Los valores `confidence` no deben inventarse sin regla documentada.

Regla sugerida inicial:

- oficial estructurado y vigente: muy alta;
- proveedor primario: alta;
- retail: alta para ese comercio;
- agregador/portal: media;
- comunidad: baja/media según cantidad y dispersión.

---

# 30. UX de fuentes

En pantalla mostrar discretamente:

```text
S/ 31.50
Promart · capturado hoy · Lima
[ver fuente]
```

O:

```text
S/ 130–170/m²
Referencia de mercado · 4 observaciones · confianza media
[ver cómo se calculó]
```

No llenar la pantalla con bibliografía salvo que el usuario la abra.

---

# 31. IA dentro del sistema

La IA es una **capa explicativa**, no el motor numérico.

Permitido:

- resumir escenario;
- explicar por qué cambió el resultado;
- generar preguntas contextuales;
- explicar diferencias entre caminos;
- traducir términos técnicos a lenguaje común;
- sugerir qué datos faltan.

No permitido:

- inventar precios;
- inventar normas;
- dimensionar estructuras sin datos profesionales;
- diagnosticar salud;
- reemplazar fórmulas financieras verificables.

Diseñar una interfaz `AiProviderAdapter` para que el proveedor pueda cambiar en el futuro.

---

# 32. Datos mock vs reales

El prototipo debe poder ejecutarse aunque algunas fuentes todavía no estén integradas.

Regla:

- `REAL`: proviene de fuente trazable;
- `SEEDED_REFERENCE`: ejemplo basado en dataset documentado;
- `MOCK`: únicamente demostración visual.

Nunca etiquetar un MOCK como “precio actual”.

La UI de desarrollo puede mostrar una insignia de origen de datos.

---

# 33. MVP recomendado

## MVP 0 — experiencia visual

Objetivo: probar si la experiencia se siente como un juego/simulador.

Implementar:

- pantalla única;
- situación habitacional;
- objetivo;
- timeline;
- 4 caminos;
- vivienda 2.5D;
- 3 eventos “¿Has pensado en esto?”;
- comparación básica;
- datos mock claramente identificados.

No integrar scraping todavía.

## MVP 1 — vivienda funcional

Implementar:

- entorno familiar;
- alquiler;
- departamento;
- terreno;
- compra;
- hipoteca;
- construcción por etapas;
- maestro/albañil;
- vaciado de techo;
- materiales;
- electricidad;
- sanitarias;
- acabados;
- mantenimiento;
- simulación determinista.

## MVP 2 — fuentes reales

Integrar primero:

1. RNE/MVCS;
2. INEI;
3. SBS;
4. Osinergmin;
5. MINSA;
6. MINEDU/SUNEDU;
7. RENIPRESS;
8. MIDAGRI;
9. 1–2 retailers de materiales;
10. Urbania Index.

## MVP 3 — 3D

- React Three Fiber + Three.js;
- GLB por capas;
- selección de etapa;
- lazy load;
- fallback model-viewer;
- fallback SVG.

## MVP 4 — familia/educación/trabajo

- embarazo;
- hijos;
- salud;
- educación;
- empleo;
- estudios superiores;
- apoyo familiar.

## MVP 5 — resiliencia

- eventos adversos;
- emprendimiento;
- escenarios favorable/base/adverso;
- comparación a 5/10/20/30 años.

---

# 34. Estructura de repositorio sugerida

```text
/apps
  /web
  /worker-api

/packages
  /domain
  /simulation-engine
  /data-contracts
  /ui
  /charts
  /house-viewer
  /source-adapters
  /database
  /config

/data
  /seed
  /schemas
  /source-catalog

/scrapers
  /retail
  /municipalities
  /market
  /official-importers

/assets
  /models
  /svg-house

/docs
  ARCHITECTURE.md
  DATA_SOURCES.md
  SIMULATION_RULES.md
  UX_GAMEPLAY.md
  SECURITY.md
  DECISIONS.md
  CHANGELOG.md

/tests
  /unit
  /integration
  /e2e
```

Mantener dominio y cálculos separados de UI.

---

# 35. Calidad de software

Obligatorio:

- TypeScript strict;
- lint;
- format;
- tests unitarios para fórmulas;
- tests de integración para adapters;
- Playwright para rutas críticas;
- accesibilidad básica;
- responsive 320 px en adelante;
- manejo de errores;
- logs estructurados;
- validación de entradas;
- no `NaN`, `Infinity` ni estados vacíos inesperados;
- documentación actualizada con cada cambio importante.

---

# 36. Pruebas mínimas

## Flujo A

Usuario vive con padres → ahorra → compra terreno → construye primer piso.

## Flujo B

Usuario alquila → compara alquiler vs departamento financiado.

## Flujo C

Usuario tiene terreno → construye → elige maestro + cuadrilla → mixer + bomba.

## Flujo D

Usuario construye → activa evento 6 meses sin ingreso → timeline se retrasa.

## Flujo E

Usuario forma familia → agrega hijo → gastos y timeline cambian.

## Flujo F

Dispositivo sin 3D suficiente → fallback 2.5D funciona.

---

# 37. Criterios de aceptación visual

El prototipo **NO cumple** si:

- parece un dashboard empresarial;
- muestra más de 8–10 cards simultáneas;
- obliga a llenar formularios largos antes de mostrar valor;
- depende de una barra lateral extensa;
- el usuario necesita abrir cinco páginas para entender su situación;
- usa un 3D pesado sin aportar información;
- las animaciones ralentizan la interacción;
- no se distingue dato real de mock.

El prototipo **sí cumple** si:

- en menos de 30 segundos el usuario ya puede iniciar una historia;
- ve un cambio visual después de elegir una decisión;
- el timeline cambia inmediatamente;
- puede volver atrás y probar otro camino;
- entiende el impacto económico sin leer documentación extensa;
- cada precio real puede abrir su fuente;
- funciona bien en móvil.

---

# 38. Diseño visual

Evitar estética genérica de IA:

- no abusar de degradados azul/morado;
- no usar bento-grid como solución universal;
- no llenar todo con cards;
- no usar glassmorphism sin propósito;
- no crear un hero enorme.

Dirección sugerida:

- fondos neutros;
- colores vivos controlados para estados del juego;
- iconografía clara;
- materiales/etapas de construcción con colores semánticos;
- tipografía web altamente legible;
- microanimaciones rápidas;
- casa/escena como foco visual.

---

# 39. Repositorios y tecnologías de referencia

## 3D

- Three.js — https://github.com/mrdoob/three.js
- React Three Fiber — https://github.com/pmndrs/react-three-fiber
- model-viewer — https://github.com/google/model-viewer
- web-ifc — https://github.com/ThatOpen/engine_web-ifc

## Animación

- Motion — https://github.com/motiondivision/motion

## Visualización

- Apache ECharts — https://github.com/apache/echarts
- React Flow / XYFlow — https://github.com/xyflow/xyflow

## Estado

- XState — https://github.com/statelyai/xstate

## Scraping / automation

- Crawlee — https://github.com/apify/crawlee
- Playwright — https://github.com/microsoft/playwright
- changedetection.io — https://github.com/dgtlmoon/changedetection.io

---

# 40. Infraestructura inicial de bajo costo

## Opción A — recomendada para prototipo

```text
Next.js / React
       │
Cloudflare Workers
       │
Cloudflare D1
       │
Cloudflare R2
```

Referencias:

- D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/

A septiembre de 2026, la documentación de Cloudflare mantiene un nivel gratuito para Workers y D1, y R2 publica un free tier mensual. Confirmar límites nuevamente antes del despliegue.

## Opción B

```text
Next.js
  │
Workers/API
  │
Neon PostgreSQL
  │
R2
```

Usar si las relaciones/consultas empiezan a requerir PostgreSQL completo.

## Opción C — demo local

PocketBase/SQLite puede ser útil para un demo local, pero no debería condicionar la arquitectura productiva.

---

# 41. API interna sugerida

```text
GET  /api/scenarios/:id
POST /api/scenarios
POST /api/scenarios/:id/simulate
POST /api/scenarios/:id/events

GET  /api/sources
GET  /api/prices/materials
GET  /api/property-market
GET  /api/municipalities/:id/procedures
GET  /api/education
GET  /api/health/facilities

POST /api/admin/ingest/:source
GET  /api/admin/ingest-runs
```

La API pública no debe exponer secretos ni funciones de administración.

---

# 42. Motor de recomendaciones

No usar un “score” opaco.

Reglas explicables:

```text
IF emergency_reserve_months < 3
AND new_purchase_uses_savings > 80%
THEN show_warning("low_reserve_after_purchase")
```

```text
IF future_floors > current_floors
AND structural_plan_confirmed == false
THEN show_warning("future_structural_capacity")
```

```text
IF child_school_start overlaps high_debt_period
THEN show_insight("education_debt_overlap")
```

El usuario debe poder ver “por qué aparece esta sugerencia”.

---

# 43. Seguridad y privacidad

En el MVP no solicitar DNI, historia clínica ni información sensible innecesaria.

Permitir escenarios anónimos/locales.

Si se crean cuentas:

- datos mínimos;
- consentimiento;
- separación de analítica y perfil;
- exportar/eliminar proyecto;
- no usar salud/genética para publicidad o scoring.

---

# 44. PROMPT MAESTRO PARA CODEX / CLAUDE

A continuación se incluye un prompt diseñado para copiar y pegar. La instrucción está en inglés para reducir ambigüedad técnica; **el producto, la interfaz y la documentación para el usuario final deben estar en español de Perú**.

```text
You are the principal product engineer, software architect, interaction designer, and data engineer responsible for building a functional prototype of a Peru-focused interactive life-planning simulator.

PROJECT GOAL
Build a web application that feels like a life-simulation game rather than a dashboard, ERP, financial form, or static informational portal. The user should be able to start from their current housing situation, choose life decisions, see an animated timeline change, see their housing/project visually evolve, and immediately understand financial consequences and resilience risks.

PRODUCT LANGUAGE
- User-facing UI: Spanish (Peru).
- User-facing explanations: concise, conversational, neutral, non-patronizing Spanish.
- Code identifiers: English.
- Technical documentation may be English or Spanish, but keep terminology consistent.

NON-NEGOTIABLE PRODUCT PRINCIPLES
1. Single primary simulation surface; avoid deep navigation.
2. Do not present dozens of form fields at once.
3. The central interaction is: current state -> decision -> simulation -> visual change -> timeline impact -> contextual insight -> next decision.
4. The user must be able to undo a decision and test another path.
5. Never label mock data as live/current data.
6. Every real external value must keep source URL, capture date, location, unit, source type, and freshness metadata.
7. Do not use an LLM for deterministic financial calculations.
8. Do not provide structural engineering dimensions, medical diagnosis, or legal conclusions that require a professional.
9. Prefer ranges and confidence information over false precision.
10. Mobile performance and clarity are mandatory.

INITIAL USER STATES
The first question is: “¿Dónde vives actualmente?”
Options:
- Tengo un terreno.
- Tengo una casa.
- Tengo un departamento.
- Vivo alquilando.
- Vivo dentro del entorno familiar.
- No tengo propiedad y quiero adquirir una.
- Quiero comparar varias alternativas.

For family housing, support contributions, free lodging, shared services, family support received, and family support paid to others.

MAIN LIFE DECISIONS
Support a modular domain model for:
- stay with family and save;
- rent;
- buy apartment;
- buy house;
- buy land;
- construct first floor;
- progressive construction;
- add floors;
- remodel;
- form a family;
- education;
- employment changes;
- entrepreneurship;
- compare scenarios.

CORE UI
Create a responsive single-screen simulation experience with:
A. Compact top HUD: savings, household income, reserve months, debt/patrimony indicator.
B. Main visual area: house/land/life project scene.
C. Context panel: one short question or insight and 2–4 actions.
D. Bottom timeline: years/months with milestones and events.
E. Optional detail drawer/bottom sheet.

Do not create a large sidebar navigation for the main simulation.

GAMEPLAY
Implement the following loop:
current state -> choice -> deterministic simulation -> animated visual transition -> timeline update -> contextual “¿Has pensado en esto?” -> next choice.

Implement a toggle named “La vida pasa” for stress-test scenarios. It must clearly say these are simulations, not predictions.
Initial stress events:
- 3/6 months without employment;
- temporary 30% income reduction;
- unexpected family expense;
- construction cost +10%;
- construction delay;
- rent increase;
- newborn earlier than planned;
- entrepreneurship income delay.

HOUSING AND CONSTRUCTION
Implement housing domains for family housing, rental, apartment, house, land, purchase, mortgage, maintenance, and construction.

Construction must model phases:
legal/site -> studies -> design -> engineering -> municipal license -> preliminaries -> earthworks -> foundations -> structure -> masonry -> slab/roof -> sanitary -> electrical -> plaster -> floors -> doors -> windows -> paint -> fixtures -> lights/switches -> furniture -> testing -> delivery -> maintenance.

Represent labor hiring models:
- daily wage;
- weekly;
- per m2;
- per linear meter;
- per m3;
- per work item;
- foreman/master + crew;
- contractor by phase;
- lump sum;
- turnkey.

Implement a specific roof/slab concrete simulation with four options:
A. mixed/prepared on site;
B. ready-mix mixer;
C. mixer + concrete pump;
D. integral contracted service.
Only estimate economic/logistical consequences. Do not invent structural quantities that were not supplied by an engineer/project.

ELECTRICAL
Separate panel, circuits, wiring, conduits, switches, receptacles, lighting, breakers, RCD/differential protection, grounding, special loads, hot-water heater, pumps, air conditioning, and future expansion. Demand estimation is informational only.

FAMILY
Design extensible timeline events for pregnancy, birth, infancy, school, healthcare, vaccines, food, clothing, insurance and higher education. Do not diagnose genetic diseases.

EDUCATION AND EMPLOYMENT
Model education as investment under uncertainty: tuition/cost, duration, forgone income, observed salary range and favorable/base/adverse scenarios. Never promise a salary.

ENTREPRENEURSHIP
Model start-up capital, operating expenses, working capital, revenue, margin, break-even and adverse scenarios. Do not assume success.

SIMULATION ENGINE
Create a pure TypeScript package for deterministic calculations. It must not depend on UI or database code.
Core functions should include:
- cashflow projection;
- patrimony projection;
- reserve runway;
- mortgage amortization;
- construction stage cost;
- recurring cost projection;
- stress-event application;
- scenario comparison.

All assumptions must be explicit and serializable.

TECH STACK
Frontend:
- Next.js
- React
- TypeScript strict

Interaction:
- Motion
- Apache ECharts
- XState for complex domain workflow states only
- React Flow only for optional “view possible paths” mode

3D:
- Three.js
- React Three Fiber as primary React integration
- GLTF/GLB assets
- lazy loading
- on-demand rendering where possible

Fallbacks:
- model-viewer for simplified 3D
- SVG/2.5D house for low-power devices or data-saving mode

Future BIM adapter:
- That Open web-ifc; do not base new implementation on the deprecated web-ifc-viewer repository.

BACKEND / STORAGE
Do NOT use Supabase.
Primary prototype option:
- Cloudflare Workers
- Cloudflare D1
- Cloudflare R2

Database access must be behind a repository/adapter layer so D1 can later be replaced by Neon/PostgreSQL without rewriting domain or UI code.

DATA INGESTION
Use API/CSV/XLSX/RSS before scraping.
If scraping is required, use Crawlee and Playwright only for publicly accessible pages where allowed. Respect terms, rate limits, caching and access controls. Never bypass CAPTCHA or authentication.

Create source adapters with metadata and raw snapshots when appropriate.

INITIAL PERU SOURCES
Construction/regulation:
- MVCS RNE: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamentonacional-de-edificaciones-rne
- SENCICO RNE updates: https://www.gob.pe/institucion/sencico/informes-publicaciones/%20887225-normas-del-reglamento-nacional-de-edificaciones-rne

Construction price indices:
- INEI: https://www.inei.gob.pe/buscador/1/?tbusqueda=precios+de+construccion

Credits:
- SBS: https://www.sbs.gob.pe/usuarios/informate-y-compara/compara-productos-financieros/compara-costos-de-creditos

Rental tax information:
- SUNAT: https://personas.sunat.gob.pe/alquilo-mi-casa-o-auto/rentas-primera-categoria

Electricity tariffs:
- Osinergmin: https://www.osinergmin.gob.pe/seccion/institucional/Paginas/VisorPliegosTarifarios.aspx

Telecom:
- OSIPTEL Checa tu Plan: https://www.checatuplan.pe/

Real estate market references:
- Urbania Index Lima: https://urbania.pe/blog/urbania-index-lima/
- BCRP apartment price indicator: https://www.bcrp.gob.pe/estadisticas/indicador-de-precios-de-venta-de-departamentos.html

Health:
- MINSA 2026 immunization standard: https://www.gob.pe/institucion/minsa/normas-legales/8265031-561-2026-minsa
- SUSALUD RENIPRESS: https://www.datosabiertos.gob.pe/dataset/registro-nacional-de-entidades-prestadoras-de-servicios-de-salud-renipress

Education:
- MINEDU open data: https://www.datosabiertos.gob.pe/group/ministerio-de-educaci%C3%B3n-minedu
- SUNEDU programs: https://www.datosabiertos.gob.pe/dataset/sunedu-programas-acad%C3%A9micos

Employment:
- MTPE Mi Carrera: https://micarrera.trabajo.gob.pe/

Food/agriculture:
- MIDAGRI Datero Agrario: https://www.datosabiertos.gob.pe/dataset/midagri-02-datero-agrario-ministerio-de-desarrollo-agrario-y-riego

RETAIL MATERIAL SOURCES
Prepare adapters for Promart, Sodimac, Maestro, Aceros Arequipa, and ready-mix/construction suppliers, but DO NOT assume scraping is allowed. First inspect public structured data, terms and robots policies. If access is unsuitable, leave an adapter stub and use documented seeded reference data.

DATA MODEL
At minimum create domain entities for users/profiles, households, projects, scenarios, assumptions, incomes, expenses, debts, assets, properties, construction stages/items, labor rates, products, price observations, suppliers, municipalities/procedures, education/health entities, career observations, risk events, timeline events, sources, source snapshots, and ingest runs.

DATA ORIGIN FLAGS
Use:
- REAL
- SEEDED_REFERENCE
- MOCK
Never show MOCK as “current price”.

REPOSITORY STRUCTURE
Use a monorepo-like modular structure with apps/web, apps/worker-api, packages/domain, packages/simulation-engine, packages/data-contracts, packages/house-viewer, packages/source-adapters, packages/database, scrapers, data/seed, assets, docs, tests.

DOCUMENTATION
Maintain:
- docs/ARCHITECTURE.md
- docs/DATA_SOURCES.md
- docs/SIMULATION_RULES.md
- docs/UX_GAMEPLAY.md
- docs/SECURITY.md
- docs/DECISIONS.md
- CHANGELOG.md
Update documentation whenever architecture, data source behavior or calculation rules change.

TESTING
- unit tests for all deterministic calculations;
- integration tests for database/source adapters;
- Playwright end-to-end tests for core flows;
- responsive tests at 320px width and desktop;
- fallback test where WebGL/3D is unavailable.

DESIGN DIRECTION
Avoid generic AI-generated web aesthetics. Do not rely on blue/purple gradients, excessive cards, glassmorphism or generic bento layouts. Use a clean neutral base, vivid controlled semantic accents, clear typography, interactive timeline and a visually dominant house/project scene.

PERFORMANCE
Do not load the 3D engine on routes/scenarios that do not need it. Lazy-load assets. Prefer lightweight GLB files and on-demand rendering. Provide SVG/2.5D fallback.

PHASED IMPLEMENTATION
Phase 0: repository, architecture, static gameplay shell, seeded data, no scraping.
Phase 1: deterministic housing/rental/purchase/construction simulation.
Phase 2: real official data adapters and source traceability.
Phase 3: retail/market adapters where permitted.
Phase 4: Three.js/R3F layered house visualization and fallbacks.
Phase 5: family, health, education and employment.
Phase 6: resilience/stress events and entrepreneurship.
Phase 7: optional AI explanation layer.

IMPORTANT EXECUTION RULE
Do not attempt to implement the entire final system as one giant page. Build the architecture and complete Phase 0 first, then Phase 1. However, design contracts/interfaces now so later phases do not require a rewrite.

FIRST DELIVERABLE
Produce a runnable Phase 0 + beginning of Phase 1 prototype that includes:
1. First question: current housing situation.
2. A single-screen simulation shell.
3. Responsive timeline.
4. Four selectable paths.
5. A simple 2.5D/SVG housing scene.
6. Cash/savings/income HUD.
7. Three contextual “¿Has pensado en esto?” rules.
8. Undo/change-path behavior.
9. A deterministic mock/seed simulation engine.
10. Clear REAL/SEEDED_REFERENCE/MOCK data-origin display in development mode.
11. Architecture docs and tests.

After building, run lint, typecheck, unit tests, build and Playwright smoke tests. Fix all failures before declaring the phase complete. Summarize in Spanish what was implemented, what is still mocked, what sources are connected, and what the next phase should implement.
```

---

# 45. PROMPTS POR FASE PARA NO SOBRECARGAR AL AGENTE

## Fase 0 — estructura y gameplay

```text
Using the master specification, implement only Phase 0. Prioritize the feeling of a playable life simulator. Do not integrate web scraping yet. Build the single-screen shell, current-housing selection, timeline, simple 2.5D house scene, deterministic seeded simulation, undo/branching, responsive mobile layout, and contextual insight engine. Create all architectural interfaces required for later D1, R2, source adapters and Three.js integration, but keep external dependencies minimal. Complete tests and documentation before finishing.
```

## Fase 1 — vivienda y construcción

```text
Continue from Phase 0 without redesigning the application. Implement the housing domain and deterministic calculations for living with family, renting, buying, mortgage simulation, land and progressive residential construction. Include construction stages, labor hiring modes, roof/slab concrete options (site mix, mixer, mixer+pump, integral service), electrical/sanitary budgets, finishes, maintenance, cost ranges, assumptions and source metadata. Keep all external price data as SEEDED_REFERENCE until a real adapter is connected.
```

## Fase 2 — fuentes oficiales

```text
Implement the source-ingestion architecture and connect the first official Peru sources listed in DATA_SOURCES.md. Prefer downloadable structured data over browser automation. Store source snapshots, normalized records, freshness, provenance and ingestion logs. Do not scrape retail yet. The UI must expose source, date and freshness without cluttering the main gameplay view.
```

## Fase 3 — mercado y retail

```text
Add market/retail adapters only after checking public accessibility and terms. Implement resilient Crawlee adapters where permitted, normalize units and product identity, store historical price observations, and detect changed values. Never bypass CAPTCHA, sessions or technical access restrictions. If a source cannot be safely automated, leave an adapter stub and document why.
```

## Fase 4 — 3D

```text
Add a lightweight layered house visualization using React Three Fiber + Three.js. Each construction stage must be independently show/hide/selectable and linked to budget/timeline state. Lazy-load the 3D package and GLB assets. Add a model-viewer fallback and an SVG/2.5D fallback. The application must remain useful with 3D disabled.
```

## Fase 5 — familia y educación

```text
Extend the timeline with family, pregnancy/birth, child-age stages, official vaccination timeline, health facilities, school, higher education and employment scenarios. Do not create medical diagnoses or guaranteed salary predictions. Keep financial effects deterministic and source-aware.
```

## Fase 6 — resiliencia y emprendimiento

```text
Implement stress-test events and entrepreneurship scenarios. Events are simulations, not predictions. Add scenario comparison for 5/10/20/30 years, reserve runway and patrimony impact. Keep recommendation rules explainable and auditable.
```

---

# 46. Qué debe entregar el agente al terminar cada fase

1. Código funcional.
2. Build exitoso.
3. Tests exitosos.
4. Capturas o descripción de las vistas principales.
5. Lista de datos reales conectados.
6. Lista de datos mock/seed pendientes.
7. Cambios de arquitectura.
8. Documentación actualizada.
9. Problemas conocidos.
10. Próxima fase recomendada.

---

# 47. Recomendación práctica para iniciar

No comenzar por Three.js ni por scraping.

Orden recomendado:

```text
1. Gameplay estático bonito
2. Timeline
3. Motor de simulación determinista
4. Vivienda/construcción
5. Trazabilidad de datos
6. Fuentes oficiales
7. Retail
8. 3D
9. Familia/educación
10. Resiliencia
11. IA explicativa
```

Razón: si la experiencia no resulta clara y entretenida con datos simulados, añadir 3D y scraping solo hará más caro un producto que todavía no demostró su mecánica central.

---

# 48. Resultado esperado del primer prototipo

Una persona debería poder abrir la web y, sin crear cuenta:

1. seleccionar “Vivo con mi familia”;
2. ingresar ingreso y ahorro aproximados;
3. escoger “quiero comprar terreno”;
4. visualizar en el timeline cuándo podría alcanzarlo bajo supuestos editables;
5. seleccionar “construir primer piso”;
6. ver una vivienda 2.5D comenzar a construirse;
7. elegir maestro/cuadrilla y alternativa de vaciado de techo;
8. ver presupuesto por fases;
9. recibir la advertencia de reserva insuficiente;
10. activar una simulación de seis meses sin ingresos;
11. observar cómo se desplaza el timeline;
12. deshacer el camino;
13. comparar con “seguir viviendo con familia y ahorrar” o “alquilar”.

Si el prototipo consigue esto con una interfaz clara, rápida y agradable, la idea central está validada y ya merece incorporar fuentes reales y 3D más avanzado.

---

# 49. Nota sobre datos y vigencia

Esta especificación fue preparada con fuentes verificadas en septiembre de 2026. Los agentes de desarrollo deben volver a revisar:

- límites de planes gratuitos;
- rutas de datasets;
- términos de uso de sitios comerciales;
- normas vigentes;
- licencias de repositorios;
- endpoints y formatos;

antes de fijarlos como dependencias permanentes.

Nunca codificar una tasa, tarifa, precio o requisito regulatorio de forma irreversible. Usar configuración versionada y metadatos de vigencia.

---

# 50. Definición corta para presentar el proyecto

> **Un simulador interactivo de proyecto de vida para Perú que permite probar decisiones de vivienda, construcción, familia, educación, trabajo y emprendimiento sobre una línea de tiempo, utilizando cálculos reproducibles y datos trazables. En lugar de decirle al usuario qué debe hacer, le permite jugar con escenarios, ver cómo cambia su proyecto y entender cuánto margen tiene frente a imprevistos.**

