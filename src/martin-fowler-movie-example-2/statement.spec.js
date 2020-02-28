import {statement} from './statement'
import {htmlStatement} from './html-statement'
import plays from './plays'
import invoices from './invoices'

describe(`statement is characterized`, () => {
  it(`as follows`, () => {
    statement(invoices[0], plays).should.equal(
      'Statement for BigCo\n' +
        '  Hamlet: $650.00 (55 seats)\n' +
        '  As You Like It: $580.00 (35 seats)\n' +
        '  Othello: $500.00 (40 seats)\n' +
        'Amount owed is $1,730.00\n' +
        'You earned 47 credits\n',
    )
  })
})

describe(`html statement`, () => {
  it(`prints a header`, () => {
    htmlStatement(invoices[0], plays).should.containEql(
      `<h1>Statement for BigCo</h1>`,
    )
  })

  it(`prints the table start`, () => {
    htmlStatement(invoices[0], plays).should.containEql(`<table>\n`)
  })

  it(`prints the header row`, () => {
    const headerRow = `<tr><th>play</th><th>seats</th><th>cost</th></tr>\n`
    htmlStatement(invoices[0], plays).should.containEql(headerRow)
  })

  it(`prints the first row`, () => {
    htmlStatement(invoices[0], plays).should.containEql(
      `  <tr><td>Hamlet</td><td>55</td>`,
    )
  })

  it(`prints the table end`, () => {
    htmlStatement(invoices[0], plays).should.containEql(`</table>\n`)
  })

  it(`prints the total in the footer`, () => {
    const totalFooter = `<p>Amount owed is <em>$1,730.00</em></p>\n`
    htmlStatement(invoices[0], plays).should.containEql(totalFooter)
  })

  it(`prints the total volume credits in the footer`, () => {
    const creditsFooter = `<p>You earned <em>47</em> credits</p>\n`
    htmlStatement(invoices[0], plays).should.containEql(creditsFooter)
  })
})
