import {configure} from './configure'

export function htmlStatement(invoice, plays) {
  return renderHtml(configure(plays, invoice))
}

function renderHtml(config) {
  return `<h1>Statement for ${config.customer}</h1>\n`
}
