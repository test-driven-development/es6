describe(`gather/spread `, () => {
  it(`parameter lists`, function() {
    const br = (x1, x2, x3) => [x1, x2, x3]

    const fu = (...args) => {
      args.unshift(42)
      return br(...args)
    }

    fu().should.deepEqual([42, undefined, undefined])
    fu(1).should.deepEqual([42, 1, undefined])
    fu(1, 2).should.deepEqual([42, 1, 2])
    fu(1, 2, 3).should.deepEqual([42, 1, 2])
  })
  it(`don't need to unshift the args array`, function() {
    const br = (x1, x2, x3) => [x1, x2, x3]

    const fu = (...args) => {
      return br(42, ...args)
    }

    fu().should.deepEqual([42, undefined, undefined])
    fu(1).should.deepEqual([42, 1, undefined])
    fu(1, 2).should.deepEqual([42, 1, 2])
    fu(1, 2, 3).should.deepEqual([42, 1, 2])
  })
})
