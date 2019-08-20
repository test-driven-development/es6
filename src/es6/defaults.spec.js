describe(`defaults `, () => {
  it(`can preserve invariants`, function() {
    const uniqId = () => 'a generated unique ID!'
    const fu = (id = uniqId()) => id

    fu(1).should.equal(1)
    fu().should.equal('a generated unique ID!')
  })

  it(`can check invariants`, function() {
    const required = () => throw new Error('Parameter required')
    const fu = (id = required()) => id

    fu(1).should.equal(1)
    ;(() => {
      fu().should.equal('unique!')
    }).should.throw('Parameter required')
  })
})
