import {configure} from './configure'
import {usd} from './usd'

export function htmlStatement(invoice, plays) {
  return renderHtml(configure(plays, invoice))
}

function renderHtml(config) {
  function printRow(config) {
    return config.performances.reduce(
      (acc, p) =>
        `  <tr><td>${p.play.name}</td><td>${p.audience}</td>` +
        `<td>${usd(p.amount / 100)}</td></tr>\n` +
        acc,
      '',
    )
  }

  return (
    `<h1>Statement for ${config.customer}</h1>\n` +
    `<table>\n` +
    `<tr><th>play</th><th>seats</th><th>cost</th></tr>\n` +
    printRow(config) +
    `</table>\n` +
    `<p>Amount owed is <em>${usd(config.total / 100)}</em></p>\n` +
    `<p>You earned <em>${config.totalVolumeCredits}</em> credits</p>\n`
  )
}
