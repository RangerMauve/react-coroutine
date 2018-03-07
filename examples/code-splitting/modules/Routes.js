import React from 'react';
import Coroutine from 'react-coroutine';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Pokemons from './PokemonAPI';
import Placeholder from './Placeholder';

/* Routes are using wrapped by Coroutine components for the sake of
   async functions and generators usage. */
export default (
  <Router>
    <article>
      <h1>Pokemons</h1>
      <Route exact path="/" component={Coroutine.create(PokemonListLoader)} />
      <Route exact path="/:pokemonId" component={Coroutine.create(PokemonInfoLoader)} />
    </article>
  </Router>
);

/* Async function that is used as a component and provides
   actual `PokemonList` once it becomes imported via async `import()`. */
async function PokemonListLoader() {
  /* Module is an object that keeps all exports from particular file.
     You can think about the result as `import * as module from '...'`.*/
  let { default: PokemonList } = await import('./PokemonList');
  return <PokemonList />;
}

/* Async generator that is used as a component for /:pokemonId page.
   It imports `PokemonInfo` component and fetches particular pokemon data
   using API. */
async function* PokemonInfoLoader({ match }) {
  /* This component is rendered every time the user opens a pokemon profile.
     However, `PokemonInfo` component will be loaded only once. After first
     usage `import('./PokemonInfo')` just returns resolved promise with module. */
  let module = import('./PokemonInfo');
  /* This request can also be cached but that's API's implementation detail.
     For the example purpose, it just does new request all the time. */
  let pokemonInfo = Pokemons.retrieve(match.params.pokemonId);
  /* Since API request takes time sometimes, we show a pending message
     and then wait for requests resolving. */
  yield (
    <Placeholder delay={2000}>
      <p>Loading...</p>
    </Placeholder>
  );
  /* Promise.all is used pretty much for example purpose. However, it's
     efficient way to make concurrent requests. */
  let [{ default: PokemonInfo }, data] = await Promise.all([module, pokemonInfo]);
  return <PokemonInfo data={data} />;
}
