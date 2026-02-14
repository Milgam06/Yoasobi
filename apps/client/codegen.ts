import { resolve } from 'path';
import { CodegenConfig } from '@graphql-codegen/cli';

const schemaPath = resolve(__dirname, '../../packages/shared/graphql/schema.gql');

const config: CodegenConfig = {
  schema: schemaPath,
  documents: ['screens/**/*.graphql'],
  generates: {
    'libs/graphql/generated.tsx': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
  ignoreNoDocuments: true,
};
export default config;
