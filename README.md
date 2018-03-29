# React Coroutine

    npm install react-coroutine

> **Coroutines** are computer program components that generalize subroutines for nonpreemptive multitasking, by allowing multiple entry points for suspending and resuming execution at certain locations. Coroutines are well-suited for implementing more familiar program components such as cooperative tasks, exceptions, event loop, iterators, infinite lists and pipes.  
> — _[Wikipedia](https://en.wikipedia.org/wiki/Coroutine)_

Describe complex async state flows in your React components using only language
features like [generators][1], [async functions][2], and [async generators][3].

No API or new abstractions to learn, only JavaScript code as it intended to be.

## Motivation

React Coroutine attempts to use basic and known language features for the sake
of solving problems that are usually solved with APIs and new abstractions that
require particular knowledge about them or, sometimes, about internal processes.

## Examples

```javascript
import React from 'react';
import Coroutine from 'react-coroutine';
```

```javascript
async function UserListContainer() {
  try {
    // Wait for async data and render it in the same way as plain components
    let users = await Users.retrieve();
    return <UserList users={users} />;
  } catch (error) {
    // Handle failures in place with just JavaScript tools
    return <ErrorMessage error={error} />;
  }
}

export default Coroutine.create(UserListContainer);
```

```javascript
async function* PokemonInfoPage({ pokemonId, pokemonName }) {
  // Use generators to provide multiple render points of your async component
  yield <p>Loading {pokemonName} info...</p>;

  // Easily import components asynchronously and render them on demand
  let { default: PokemonInfo } = await import('./PokemonInfo.react');
  let data = await PokemonAPI.retrieve(pokemonId);

  return <PokemonInfo data={data} />;
}

export default Coroutine.create(PokemonInfoPage);
```

```javascript
function* MovieInfoLoader({ movieId }) {
  // Assuming cache.read() return a value from cache or Promise
  let movieData = yield movieCache.read(movieId);
  return <MovieInfo data={movieData} />;
}

export default Coroutine.create(MovieInfoLoader);
```

## Documentation

See [details page](https://react-coroutine.js.org/Details.html) for more.

## Installation

React Coroutine project is available as the `react-coroutine` package on NPM.
Installed package includes precompiled code (ECMAScript 5), ES Modules-friendly
artifact, [LICENSE](./LICENSE), and [the changelog](./CHANGELOG.md).

## Contributing

Current project has adopted a [Code of Conduct](./CODE_OF_CONDUCT.md) which is
expected to be adhered by project participants. Please also visit [the document
website](https://www.contributor-covenant.org/) to learn more.

Please read [the contributing guide](./CONTRIBUTING.md) to learn how to propose
bug fixes and improvements, and how to build and test your changes.

 [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
 [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 [3]: https://github.com/tc39/proposal-async-iteration
