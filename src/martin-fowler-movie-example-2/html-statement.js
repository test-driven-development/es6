import {configure} from './configure'
import {usd} from './usd'

export function htmlStatement(invoice, plays) {
  return renderHtml(configure(plays, invoice))
}

function renderHtml(config) {
  function printRow(config) {
    const perf = config.performances[0]
    return (
      `  <tr><td>${perf.play.name}</td><td>${perf.audience}</td>` +
      `<td>$650.00</td></tr>\n`
    )
  }

  return (
    `<h1>Statement for ${config.customer}</h1>\n` +
    `<table>\n` +
    `<tr><th>play</th><th>seats</th><th>cost</th></tr>\n` +
    printRow(config) +
    `</table>\n` +
    `<p>You earned <em>${config.totalVolumeCredits}</em> credits</p>\n` +
    `<p>Amount owed is <em>${usd(config.total / 100)}</em></p>\n`
  )
}
