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
