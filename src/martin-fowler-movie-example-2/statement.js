import {configure} from './configure'

export function statement(invoice, plays) {
  return renderPlainText(invoice, plays, configure(plays, invoice))
}

function renderPlainText(invoice, plays, config) {
  let result = `Statement for ${config.customer}\n`
  const performances = config.performances

  for (let performance of performances) {
    const play = performance.play.name
    const amount = performance.amount
    const audience = performance['audience']

    result += `  ${play}: ${usd(amount / 100)} (${audience} seats)\n`
  }

  result += `Amount owed is ${usd(config.total / 100)}\n`
  result += `You earned ${config.totalVolumeCredits} credits\n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber)
  }
}
