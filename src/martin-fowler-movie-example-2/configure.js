const shallowClone = obj => ({...obj})

const calculatorFactoryMake = (performance, play) => {
  const calculator = performanceCalculator(performance, play)
  switch (play.type) {
    case 'tragedy':
      return tragedyCalculator(calculator)
    case 'comedy':
      return comedyCalculator(calculator)
    default:
      throw new Error(`unknown type: ${play.type}`)
  }
}
const comedyCalculator = calculator => {
  return {
    play: calculator.play,
    performance: calculator.performance,
    amount: calculator.amount,
    volumeCredits: calculator.volumeCredits,
  }
}
const tragedyCalculator = calculator => {
  const performance = calculator.performance
  const play = calculator.play
  const audience = performance.audience

  function amountForTragedy() {
    return audience > 30 ? 40000 + 1000 * (audience - 30) : 40000
  }

  return {
    play,
    performance,
    amount: amountForTragedy(),
    volumeCredits: calculator.volumeCredits,
  }
}

function performanceCalculator(performance_, play_) {
  const play = play_
  const performance = performance_

  function amountForComedy() {
    let amount = 30000
    if (performance.audience > 20) {
      amount += 10000 + 500 * (performance.audience - 20)
    }
    amount += 300 * performance.audience
    return amount
  }
  function amountForTragedy() {
    let amount = 40000
    if (performance.audience > 30) {
      amount += 1000 * (performance.audience - 30)
    }
    return amount
  }

  function amountFor() {
    let amount = 0

    switch (play.type) {
      case 'tragedy':
        amount = amountForTragedy()
        break
      case 'comedy':
        amount = amountForComedy()
        break
      default:
        throw new Error(`unknown type: ${play.type}`)
    }

    return amount
  }
  function volumeCreditsFor() {
    let credits = 0
    credits += Math.max(performance.audience - 30, 0)
    if (play.type === 'comedy') credits += Math.floor(performance.audience / 5)
    return credits
  }

  return {
    play,
    performance,
    amount: amountFor(),
    volumeCredits: volumeCreditsFor(),
  }
}

export function configure(plays, invoice) {
  function playFor(performance) {
    return plays[performance.playID]
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
    const calculator = calculatorFactoryMake(performance, playFor(performance))
    performance.play = calculator.play
    performance.amount = calculator.amount
    performance.volumeCredits = calculator.volumeCredits
    return performance
  }

  const config = {}
  config.customer = invoice.customer
  config.performances = invoice.performances.map(configurePerformance)
  config.totalVolumeCredits = totalVolumeCredits(config.performances)
  config.total = total(config.performances)
  return config
}
