describe(`deconstruct arrays `, () => {
  it(``, function() {
    const team = ['Joe', 'Dyan', 'Bea', 'Theo'];

    function alphabetizeTeam(team) {
      return team.sort(); // ['Bea', 'Dyan', 'Joe', 'Theo']
    }

    alphabetizeTeam(team).should.deepEqual(['Bea', 'Dyan', 'Joe', 'Theo'])
  })

  it(`is like pattern matching`, function() {
    const [a, b, c] = [1, 2, 3]
    a.should.equal(1)
    b.should.equal(2)
    c.should.equal(3)
  })

  it(`no match leaves undefined`, function() {
    const [a, b, c] = [1, 2]
    a.should.equal(1)
    b.should.equal(2)
    should(c).be.undefined()
  })

  it(`can have defaults`, function() {
    const [a, b = 42, c] = [1, , 2]
    a.should.equal(1)
    b.should.equal(42)
    c.should.equal(2)
  })

  it(`will decompose nested arrays`, function() {
    const [a, b = 42, c, [d, , e]] = [1, 2, 3, [4, 5, 6]]
    a.should.equal(1)
    b.should.equal(2)
    c.should.equal(3)
    d.should.equal(4)
    e.should.equal(6)
  })

  it(`will give a type error`, function() {
    ;(() => {
      const [a, b = 42, c] = null
    }).should.throwError()
  })

  it(`can safely avoid type errors`, function() {
    // noinspection PointlessBooleanExpressionJS
    const [a, b = 42, c] = null || []
    should(a).be.undefined()
    b.should.equal(42)
    should(c).be.undefined()
  })

  it(`will gather remaining values`, function() {
    const [a, b = 42, c, ...args] = [1, 2, 3, 4, 5, 6, 7, 8]
    args.length.should.equal(5)
    args[3].should.equal(7)
  })

  it(`won't gather absent values`, function() {
    const [a, b = 42, c, ...args] = [1, 2, 3]
    args.length.should.equal(0)
  })

  it(`does not have to be paired with declaration`, function() {
    let a, b, c, args
    ;[a, b = 42, c, ...args] = [1, 2, 3, 4, 5, 6, 7, 8]
    args.length.should.equal(5)
    args[3].should.equal(7)
  })

  it(`won't gather absent values`, function() {
    const [a, b = 42, c, ...args] = [1, 2, 3]
    args.length.should.equal(0)
  })

  it(`will deconstruct into object properties`, function() {
    const o = {}
    ;[o.a, o.b = 42, o.c, ...o.args] = [1, undefined, 3, 4, 5, 6, 7, 8]
    o.a.should.equal(1)
    o.b.should.equal(42)
    o.c.should.equal(3)
    o.args.length.should.equal(5)
  })

  it(`can facilitate swapping`, function() {
    let x = 10
    let y = 20

    ;[x, y] = [y, x]

    x.should.equal(20)
    y.should.equal(10)
  })

  it(`can dump items`, function() {
    let a = [1, 2, 3]

    let x, y
    ;[x, y, ...a] = [0, ...a, 4]

    a[0].should.equal(2)
    a.length.should.equal(3)
    a[2].should.equal(4)
  })

  it(`can dump without variables`, function() {
    let a = [1, 2, 3]

    ;[, , ...a] = [0, ...a, 4]

    a[0].should.equal(2)
    a.length.should.equal(3)
    a[2].should.equal(4)
  })
})
