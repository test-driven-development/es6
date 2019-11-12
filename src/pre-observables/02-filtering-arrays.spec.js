describe(`filtering arrays `, () => {
  it(`filter forEach`, function() {
    let videos = []

    newReleases.forEach(x => {
      if (x.rating === 5.0) videos = videos.concat([x])
    })

    videos.should.deepEqual([
      {
        id: 654356453,
        title: 'Bad Boys',
        boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5,
        bookmark: [{id: 432534, time: 65876586}],
      },
      {
        id: 675465,
        title: 'Fracture',
        boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ])
  })

  it(`Array.filter`, function() {
    newReleases
      .filter(x => x.rating === 5.0)
      .should.deepEqual([
        {
          id: 654356453,
          title: 'Bad Boys',
          boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
          uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
          rating: 5,
          bookmark: [{id: 432534, time: 65876586}],
        },
        {
          id: 675465,
          title: 'Fracture',
          boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
          uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
          rating: 5,
          bookmark: [{id: 432534, time: 65876586}],
        },
      ])
  })

  it(`chain filter and map`, function() {
    newReleases
      .filter(x => x.rating === 5.0)
      .map(x => x.id)
      .should.deepEqual([654356453, 675465])
  })
})

const newReleases = [
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
]
