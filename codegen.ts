import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
   overwrite: true,
   schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
   documents: 'src/**/*.gql',
   generates: {
      'src/gql/graphql.ts': {
         plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      },
   },
}

export default config
