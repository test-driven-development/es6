export function statement(invoice, plays) {
  let result = `Statement for ${invoice['customer']}\n`
  const performances = invoice['performances']
  for (let performance of performances) {
    const play = playFor(performance).name
    const amount = amountFor(performance)
    const audience = performance['audience']

    result += `  ${play}: ${usd(amount / 100)} (${audience} seats)\n`
  }

  result += `Amount owed is ${usd(total() / 100)}\n`
  result += `You earned ${totalVolumeCredits()} credits\n`
  return result

  function playFor(aPerformance) {
    return plays[aPerformance['playID']]
  }

  function amountFor(aPerformance) {
    let result = 0

    switch (playFor(aPerformance).type) {
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
        throw new Error(`unknown type: ${playFor(aPerformance).type}`)
    }

    return result
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0
    result += Math.max(aPerformance['audience'] - 30, 0)

    if (playFor(aPerformance).type === 'comedy')
      result += Math.floor(aPerformance['audience'] / 5)

    return result
  }

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber)
  }

  function totalVolumeCredits() {
    let credits = 0
    for (let perf of performances) credits += volumeCreditsFor(perf)
    return credits
  }

  function total() {
    let totalAmount = 0
    for (let perf of performances) totalAmount += amountFor(perf)
    return totalAmount
  }
}
