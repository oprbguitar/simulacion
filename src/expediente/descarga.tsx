import { renderToStaticMarkup } from 'react-dom/server'
import estilos from '../expediente.css?raw'
import { proyectar, type Perfil } from '../domain/life/motor'
import { DocumentoExpediente } from './Documento'

/**
 * Genera el expediente como un archivo HTML autocontenido y lo descarga.
 * Se renderiza en el navegador de la persona: nada se envía a un servidor.
 * El archivo abre sin conexión (salvo las fuentes tipográficas) y se puede
 * imprimir o guardar como PDF desde cualquier navegador.
 */
export function descargarExpediente(perfil: Perfil, nombre: string) {
  const proyeccion = proyectar(perfil)
  const fecha = new Date()
  const cuerpo = renderToStaticMarkup(<DocumentoExpediente proyeccion={proyeccion} nombre={nombre} fecha={fecha} />)
  const titulo = nombre.trim() ? `Expediente de vida de ${nombre.trim()}` : 'Mi expediente de vida'

  const html = `<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)}</title>
<style>
body { margin: 0; background: #f6f7f3; }
${estilos}
</style>
</head>
<body>
${cuerpo}
</body>
</html>`

  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  enlace.download = `expediente-${slug(nombre) || 'de-vida'}-${fecha.toISOString().slice(0, 10)}.html`
  document.body.append(enlace)
  enlace.click()
  enlace.remove()
  setTimeout(() => URL.revokeObjectURL(enlace.href), 4000)
}

function escapar(texto: string) {
  return texto.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)
}

function slug(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
