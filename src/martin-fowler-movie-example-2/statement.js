export function statement(invoice, plays) {
  const config = {}
  config.customer = invoice.customer

  config.performances = invoice.performances.map(p => {
    const performance = {...p}
    performance.play = playFor(performance)
    performance.amount = amountFor(performance)
    performance.volumeCredits = volumeCreditsFor(performance)
    return performance
  })

  return renterPlainText(invoice, plays, config)

  function playFor(performance) {
    return plays[performance.playID]
  }

  function amountFor(aPerformance) {
    let result = 0

    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000
        if (aPerformance['audience'] > 30) {
          result += 1000 * (aPerformance['audience'] - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance['audience'] > 20) {
          result += 10000 + 500 * (aPerformance['audience'] - 20)
        }
        result += 300 * aPerformance['audience']
        break
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`)
    }

    return result
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0
    result += Math.max(aPerformance['audience'] - 30, 0)

    if (aPerformance.play.type === 'comedy')
      result += Math.floor(aPerformance['audience'] / 5)

    return result
  }
}

function renterPlainText(invoice, plays, config) {
  let result = `Statement for ${config.customer}\n`
  const performances = config.performances
  for (let performance of performances) {
    const play = performance.play.name
    const amount = performance.amount
    const audience = performance['audience']

    result += `  ${play}: ${usd(amount / 100)} (${audience} seats)\n`
  }

  result += `Amount owed is ${usd(total() / 100)}\n`
  result += `You earned ${totalVolumeCredits()} credits\n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber)
  }

  function totalVolumeCredits() {
    let credits = 0
    for (let perf of performances) credits += perf.volumeCredits
    return credits
  }

  function total() {
    let totalAmount = 0
    for (let perf of performances) totalAmount += perf.amount
    return totalAmount
  }
}
