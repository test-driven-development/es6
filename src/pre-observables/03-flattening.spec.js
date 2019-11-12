describe(`flattening `, () => {
  it(`flattening 2-levels forEach`, function() {
    let allVideoIdsInMovieLists = []

    simpleMovieLists.forEach(movieList => {
      movieList.videos.forEach(video => {
        allVideoIdsInMovieLists = allVideoIdsInMovieLists.concat([video.id])
      })
    })

    allVideoIdsInMovieLists.should.deepEqual([
      70111470,
      654356453,
      65432445,
      675465,
    ])
  })

  it(`flattening 2-levels concatAll`, function() {
    simpleMovieLists
      .map(x => x.videos)
      .concatAll()
      .map(video => video.id)
      .should.deepEqual([70111470, 654356453, 65432445, 675465])
  })

  it(`flattening 3-levels concatAll`, function() {
    firstMovieList
      .map(movieList =>
        movieList.videos
          .map(video =>
            video.boxarts
              .filter(boxart => boxart.width === 150)
              .map(boxart => ({
                id: video.id,
                title: video.title,
                boxart: boxart.url,
              })),
          )
          .concatAll(),
      )
      .concatAll()
      .should.deepEqual([
        {
          id: 70111470,
          title: 'Die Hard',
          boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
        },
        {
          id: 654356453,
          title: 'Bad Boys',
          boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg',
        },
        {
          id: 65432445,
          title: 'The Chamber',
          boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg',
        },
        {
          id: 675465,
          title: 'Fracture',
          boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
        },
      ])
  })

  it(`flattening 3-levels concatMap`, function() {
    firstMovieList
      .concatMap(movieList =>
        movieList.videos.concatMap(video =>
          video.boxarts
            .filter(boxart => boxart.width === 150)
            .map(boxart => ({
              id: video.id,
              title: video.title,
              boxart: boxart.url,
            })),
        ),
      )
      .should.deepEqual([
        {
          id: 70111470,
          title: 'Die Hard',
          boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
        },
        {
          id: 654356453,
          title: 'Bad Boys',
          boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg',
        },
        {
          id: 65432445,
          title: 'The Chamber',
          boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg',
        },
        {
          id: 675465,
          title: 'Fracture',
          boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
        },
      ])
  })

  it(`simple max`, () => {
    ;[2, 3, 1, 4, 5].reduce_(Math.max).should.deepEqual([5])
  })

  it(`simple reduce`, () => {
    ;[2, 3, 1, 4, 5].reduce_(Math.max).should.deepEqual([5])
  })

  it(`reduce picks the smallest url`, () => {
    boxarts
      .reduce_((x, y) => (x.width * x.height < y.width * y.height ? x : y))
      .map(x => x.url)
      .should.deepEqual([
        'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
      ])
  })

  it(`map reduce`, () => {
    videos
      .reduce_((x, y) => {
        const o = {}
        o[y.id] = y.title
        return Object.assign(x, o)
      }, {})
      .should.deepEqual([
        {
          '65432445': 'The Chamber',
          '675465': 'Fracture',
          '70111470': 'Die Hard',
          '654356453': 'Bad Boys',
        },
      ])
  })

  it(`map filter nested`, () => {
    secondMovieLists
      .concatMap(movieList =>
        movieList.videos.concatMap(video =>
          video.boxarts
            .filter(boxart => boxart.width <= 150)
            .map(boxart => ({
              id: video.id,
              title: video.title,
              boxart: boxart.url,
            })),
        ),
      )
      .should.deepEqual([
        {
          id: 70111470,
          title: 'Die Hard',
          boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
        },
        {
          id: 654356453,
          title: 'Bad Boys',
          boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg',
        },
        {
          id: 65432445,
          title: 'The Chamber',
          boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg',
        },
        {
          id: 675465,
          title: 'Fracture',
          boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture120.jpg',
        },
      ])
  })

  it(`map reduce nested`, () => {
    secondMovieLists
      .concatMap(movieList =>
        movieList.videos.concatMap(video =>
          video.boxarts
            .reduce_((x, y) =>
              x.width * x.height < y.width * y.height ? x : y,
            )
            .map(boxart => ({
              id: video.id,
              title: video.title,
              boxart: boxart.url,
            })),
        ),
      )
      .should.deepEqual([
        {
          id: 70111470,
          title: 'Die Hard',
          boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
        },
        {
          id: 654356453,
          title: 'Bad Boys',
          boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg',
        },
        {
          id: 65432445,
          title: 'The Chamber',
          boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg',
        },
        {
          id: 675465,
          title: 'Fracture',
          boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture120.jpg',
        },
      ])
  })
})

const secondMovieLists = [
  {
    name: 'New Releases',
    videos: [
      {
        id: 70111470,
        title: 'Die Hard',
        boxarts: [
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
          },
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/DieHard200.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 654356453,
        title: 'Bad Boys',
        boxarts: [
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg',
          },
          {
            width: 140,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
  {
    name: 'Thrillers',
    videos: [
      {
        id: 65432445,
        title: 'The Chamber',
        boxarts: [
          {
            width: 130,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg',
          },
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 675465,
        title: 'Fracture',
        boxarts: [
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture200.jpg',
          },
          {
            width: 120,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture120.jpg',
          },
          {
            width: 300,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture300.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
]

const simpleMovieLists = [
  {
    name: 'New Releases',
    videos: [
      {
        id: 70111470,
        title: 'Die Hard',
        boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 654356453,
        title: 'Bad Boys',
        boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
  {
    name: 'Dramas',
    videos: [
      {
        id: 65432445,
        title: 'The Chamber',
        boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 675465,
        title: 'Fracture',
        boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
]

const firstMovieList = [
  {
    name: 'Instant Queue',
    videos: [
      {
        id: 70111470,
        title: 'Die Hard',
        boxarts: [
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
          },
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/DieHard200.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 654356453,
        title: 'Bad Boys',
        boxarts: [
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg',
          },
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
  {
    name: 'New Releases',
    videos: [
      {
        id: 65432445,
        title: 'The Chamber',
        boxarts: [
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg',
          },
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 675465,
        title: 'Fracture',
        boxarts: [
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture200.jpg',
          },
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
          },
          {
            width: 300,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture300.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
]

const boxarts = [
  {
    width: 200,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture200.jpg',
  },
  {
    width: 150,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
  },
  {
    width: 300,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture300.jpg',
  },
  {
    width: 425,
    height: 150,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture425.jpg',
  },
]

const videos = [
  {
    id: 65432445,
    title: 'The Chamber',
  },
  {
    id: 675465,
    title: 'Fracture',
  },
  {
    id: 70111470,
    title: 'Die Hard',
  },
  {
    id: 654356453,
    title: 'Bad Boys',
  },
]

Array.prototype.reduce_ = function(combiner, initialValue) {
  let counter, accumulatedValue

  if (this.length === 0) {
    return this
  } else {
    if (arguments.length === 1) {
      counter = 1
      accumulatedValue = this[0]
    } else if (arguments.length >= 2) {
      counter = 0
      accumulatedValue = initialValue
    } else {
      throw 'Invalid arguments.'
    }

    while (counter < this.length) {
      accumulatedValue = combiner(accumulatedValue, this[counter])
      counter++
    }

    return [accumulatedValue]
  }
}

Array.prototype.concatAll = function() {
  let results = []
  this.forEach(function(subArray) {
    results = results.concat(subArray)
  })

  return results
}

Array.prototype.concatMap = function(projectionFunctionThatReturnsArray) {
  return this.map(function(item) {
    return projectionFunctionThatReturnsArray(item)
  }).concatAll()
}
