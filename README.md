# es6
> (work-in-progress)
 
 ## dev environment

```js
// package.json
  "engines": {
    "node": ">=10",
    "npm": ">=6",
    "yarn": ">=1"
  }
```        
_requires git `>= 2.13.0`_
 
## install
```sh
yarn install
```

## run
```sh
yarn tdd
```

## scripts
```js
// package.json
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,html}\"",
    "lint": "esw \"src/**/*.{js,jsx}\" --quiet",
    "lint:watch": "yarn lint --watch",
    "test": "NODE_ENV=testing jest --forceExit --notify --detectOpenHandles  --silent src",
    "test:watch": "yarn test --watch",
    "tdd": "npm-run-all --parallel lint:watch test:watch",
    "validate": "yarn format && yarn lint && yarn test -- --coverage"
  }
```        

## commit hook
```js
// package.json
  "husky": {
    "hooks": {
      "pre-push": "yarn validate"
    }
  }
```        

## License
MIT
