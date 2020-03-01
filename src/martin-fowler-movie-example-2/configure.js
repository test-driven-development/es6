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
  const performance = calculator.performance
  const play = calculator.play
  const audience = performance.audience

  const increment = 300 * audience
  const conditionalIncrement = 500 * (audience - 20)

  const amount = (() =>
    audience > 20
      ? 30000 + increment + 10000 + conditionalIncrement
      : 30000 + increment)()

  const volumeCredits = (() => Math.floor(audience / 5))()

  return {
    play,
    performance,
    amount,
    volumeCredits: calculator.volumeCredits + volumeCredits,
  }
}
const tragedyCalculator = calculator => {
  const performance = calculator.performance
  const play = calculator.play
  const audience = performance.audience

  const amount = (() =>
    audience > 30 ? 40000 + 1000 * (audience - 30) : 40000)()

  return {
    play,
    performance,
    amount,
    volumeCredits: calculator.volumeCredits,
  }
}
function performanceCalculator(performance, play) {
  return {
    play,
    performance,
    volumeCredits: Math.max(performance.audience - 30, 0),
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
