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

  it('zips', () => {
    Array.zip(videos_, bookmarks, (x, y) => ({
      videoId: x.id,
      bookmarkId: y.id,
    })).should.deepEqual([
      {videoId: 70111470, bookmarkId: 470},
      {videoId: 654356453, bookmarkId: 453},
      {videoId: 65432445, bookmarkId: 445},
    ])
  })

  it('zips {id, title, time, url}', () => {
    thirdMovieLists
      .concatMap(movieList =>
        movieList.videos.concatMap(video => {
          return Array.zip(
            video.boxarts.reduce_((accum, boxart) =>
              accum.width < boxart.width ? accum : boxart,
            ),
            video.interestingMoments.filter(moment => moment.type === 'Middle'),
            (boxart, moment) => ({
              id: video.id,
              title: video.title,
              time: moment.time,
              url: boxart.url,
            }),
          )
        }),
      )
      .should.deepEqual([
        {
          id: 70111470,
          title: 'Die Hard',
          time: 323133,
          url: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
        },
        {
          id: 654356453,
          title: 'Bad Boys',
          time: 6575665,
          url: 'http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg',
        },
        {
          id: 65432445,
          title: 'The Chamber',
          time: 3452343,
          url: 'http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg',
        },
        {
          id: 675465,
          title: 'Fracture',
          time: 3453434,
          url: 'http://cdn-0.nflximg.com/images/2891/Fracture120.jpg',
        },
      ])
  })

  it('query', () => {
    _lists
      .map(list => ({
        name: list.name,
        videos: _videos
          .filter(video => video.listId === list.id)
          .concatMap(video => {
            return Array.zip(
              _bookmarks.filter(x => x.videoId === video.id),
              _boxarts
                .filter(x => x.videoId === video.id)
                .reduce_((acc, cur) => (acc.width < cur.width ? acc : cur)),
              (bookmark, boxart) => ({
                id: video.id,
                title: video.title,
                time: bookmark.time,
                boxart: boxart.url,
              }),
            )
          }),
      }))
      .should.deepEqual([
        {
          name: 'New Releases',
          videos: [
            {
              id: 65432445,
              title: 'The Chamber',
              time: 32432,
              boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg',
            },
            {
              id: 675465,
              title: 'Fracture',
              time: 3534543,
              boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture120.jpg',
            },
          ],
        },
        {
          name: 'Thrillers',
          videos: [
            {
              id: 70111470,
              title: 'Die Hard',
              time: 645243,
              boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
            },
            {
              id: 654356453,
              title: 'Bad Boys',
              time: 984934,
              boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg',
            },
          ],
        },
      ])
  })
})

const _lists = [
  {
    id: 5434364,
    name: 'New Releases',
  },
  {
    id: 65456475,
    name: 'Thrillers',
  },
]

const _videos = [
  {
    listId: 5434364,
    id: 65432445,
    title: 'The Chamber',
  },
  {
    listId: 5434364,
    id: 675465,
    title: 'Fracture',
  },
  {
    listId: 65456475,
    id: 70111470,
    title: 'Die Hard',
  },
  {
    listId: 65456475,
    id: 654356453,
    title: 'Bad Boys',
  },
]

const _boxarts = [
  {
    videoId: 65432445,
    width: 130,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg',
  },
  {
    videoId: 65432445,
    width: 200,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg',
  },
  {
    videoId: 675465,
    width: 200,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture200.jpg',
  },
  {
    videoId: 675465,
    width: 120,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture120.jpg',
  },
  {
    videoId: 675465,
    width: 300,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture300.jpg',
  },
  {
    videoId: 70111470,
    width: 150,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
  },
  {
    videoId: 70111470,
    width: 200,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/DieHard200.jpg',
  },
  {
    videoId: 654356453,
    width: 200,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg',
  },
  {
    videoId: 654356453,
    width: 140,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg',
  },
]

const _bookmarks = [
  {videoId: 65432445, time: 32432},
  {videoId: 675465, time: 3534543},
  {videoId: 70111470, time: 645243},
  {videoId: 654356453, time: 984934},
]

const thirdMovieLists = [
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
        interestingMoments: [
          {type: 'End', time: 213432},
          {type: 'Start', time: 64534},
          {type: 'Middle', time: 323133},
        ],
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
        interestingMoments: [
          {type: 'End', time: 54654754},
          {type: 'Start', time: 43524243},
          {type: 'Middle', time: 6575665},
        ],
      },
    ],
  },
  {
    name: 'Instant Queue',
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
        interestingMoments: [
          {type: 'End', time: 132423},
          {type: 'Start', time: 54637425},
          {type: 'Middle', time: 3452343},
        ],
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
        interestingMoments: [
          {type: 'End', time: 45632456},
          {type: 'Start', time: 234534},
          {type: 'Middle', time: 3453434},
        ],
      },
    ],
  },
]

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

const videos_ = [
  {
    id: 70111470,
    title: 'Die Hard',
    boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 4.0,
  },
  {
    id: 654356453,
    title: 'Bad Boys',
    boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 5.0,
  },
  {
    id: 65432445,
    title: 'The Chamber',
    boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 4.0,
  },
  {
    id: 675465,
    title: 'Fracture',
    boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 5.0,
  },
]

const bookmarks = [
  {id: 470, time: 23432},
  {id: 453, time: 234324},
  {id: 445, time: 987834},
]

Array.zip = function(left, right, combinerFunction) {
  let counter
  let results = []

  for (counter = 0; counter < Math.min(left.length, right.length); counter++) {
    results = results.concat(combinerFunction(left[counter], right[counter]))
  }

  return results
}

/* eslint-disable no-extend-native */
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
      throw new Error(`Invalid arguments.`)
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
