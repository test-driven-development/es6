describe(`deconstruct objects can `, () => {
  const make = (overrides = {}) => {
    return {id: 1, ...overrides}
  }

  it(`default parameters`, function() {
    const obj = make()
    obj.id.should.equal(1)
  })

  it(`override parameters`, function() {
    const obj = make({id: 2, hello: 'hey'})
    obj.id.should.equal(2)
    obj.hello.should.equal('hey')
  })
})
