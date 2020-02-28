import {statement} from './statement'
import plays from './plays'
import invoices from './invoices'

describe(`statement is characterized`, () => {
  it(`as follows`, function() {
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
  it(`prints a header`, function() {
    htmlStatement(invoices[0], plays).should.containEql(
      `<h1>Statement for BigCo</h1>`,
    )
  })
})
