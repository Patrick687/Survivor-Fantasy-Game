
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schema.gql",
  generates: {
    "test/integration/generated.types.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
