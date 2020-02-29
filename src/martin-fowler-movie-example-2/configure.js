const shallowClone = obj => ({...obj})

function performanceCalculator(performance_, play_) {
  const play = play_
  const performance = performance_
  function amountFor(performance) {
    let result = 0

    switch (play.type) {
      case 'tragedy':
        result = 40000
        if (performance['audience'] > 30) {
          result += 1000 * (performance['audience'] - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (performance['audience'] > 20) {
          result += 10000 + 500 * (performance['audience'] - 20)
        }
        result += 300 * performance['audience']
        break
      default:
        throw new Error(`unknown type: ${play.type}`)
    }

    return result
  }

  return {
    play,
    performance,
    amount: amountFor(performance),
  }
}

export function configure(plays, invoice) {
  function playFor(performance) {
    return plays[performance.playID]
  }
  function volumeCreditsFor(performance) {
    let result = 0
    result += Math.max(performance['audience'] - 30, 0)

    if (performance.play.type === 'comedy')
      result += Math.floor(performance['audience'] / 5)

    return result
  }
  function totalVolumeCredits(performances) {
    return performances.reduce((acc, p) => {
      return p.volumeCredits + acc
    }, 0)
  }
  function total(performances) {
    return performances.reduce((acc, p) => {
      return p.amount + acc
    }, 0)
  }

  function configurePerformance(p) {
    const performance = shallowClone(p)
    const calculator = performanceCalculator(performance, playFor(performance))
    performance.play = calculator.play
    performance.amount = calculator.amount
    performance.volumeCredits = volumeCreditsFor(performance)
    return performance
  }

  const config = {}
  config.customer = invoice.customer
  config.performances = invoice.performances.map(configurePerformance)
  config.totalVolumeCredits = totalVolumeCredits(config.performances)
  config.total = total(config.performances)
  return config
}
