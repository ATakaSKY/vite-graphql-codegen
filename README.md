# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-  [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-  [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-  Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

-  Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-  Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-  Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Adding graphql-codegen in the project - GraphQL Code Generator Setup

Here's the steps outlined:

-  First add the cli:
   `yarn add -D @graphql-codegen/cli`
   <br />

-  GraphQL Code Generator reads all the configuration from a codegen.ts. We can use the wizard feature to generate it for us. Let’s run it:
   `yarn graphql-codegen init`
   <br />

-  For react-apollo, run this command:
   `yarn add --dev @graphql-codegen/typescript-react-apollo`
   <br />

-  Use the client-preset package for a better developer experience and smaller impact on bundle size:
   `yarn add --dev @graphql-codegen/cli`
   <br />

-  Ultimately this is how codegen.ts file should look like:

```
   import type { CodegenConfig } from '@graphql-codegen/cli'

   const config: CodegenConfig = {
      overwrite: true,
      schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      documents: 'src/**/*.gql',
      generates: {
         'src/gql/': {
            preset: 'client',
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
         },
      },
   }

   export default config
```

<br />

-  We can finally generate our first GraphQL query by using:
   `yarn codegen`
   <br />

### Configuring Apollo client

Before being able to use and execute our generated query we need to have the Apollo Client setup.
`yarn add @apollo/client graphql`

> **`@apollo/client`**: This single package contains virtually everything you need to set up Apollo Client. It includes the in-memory cache, local state management, error handling, and a React-based view layer.
> **`graphql`**: This package provides logic for parsing GraphQL queries.
> apollographql.com

Note that we are using `typescript-react-apollo` in our `codegen.ts` which does already generate Apollo specific queries.

Configuring the Apollo Client and Provider:

```
import '../styles/globals.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
```

## Using the Generated GraphQL Query

With all the environment set up, it’s time to use our generated query. When using the Apollo integration the generator will provide automatic or manual queries:

```
// trigger automatically when components renders
const { data, loading} = useAllPlanetsQuery();

// triggered manually by calling "getPlanets" method
const [getPlanets, { loading, data }] = useAllPlanetsLazyQuery();
```

With everything in action:

```
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { Planet, useAllPlanetsQuery } from './gql/graphql'

const client = new ApolloClient({
   uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
   cache: new InMemoryCache(),
})

function PlanetComp({ item }: { item: Planet | null }) {
   return (
      <li key={item?.id}>
         {item?.name} - {item?.population ? `${item.population} habitants` : 'N/A'}
      </li>
   )
}

function ListAllPlanets() {
   const { data, loading, error } = useAllPlanetsQuery()

   if (error) return <div>Error 123</div>

   return loading ? (
      <div>loading...</div>
   ) : (
      <ul>
         {data?.allPlanets?.planets?.map((item) => {
            return <PlanetComp item={item} />
         })}
      </ul>
   )
}

function MyApp() {
   return (
      <ApolloProvider client={client}>
         <ListAllPlanets />
      </ApolloProvider>
   )
}

export default MyApp

```
