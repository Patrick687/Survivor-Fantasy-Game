export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

type EnvType = 'string' | 'number' | 'enum' | 'boolean';

export function requireEnvVariable(
  variableName: string,
  type: EnvType = 'string',
  enumValues?: string[],
): string | number | boolean {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(`Environment variable ${variableName} is not set`);
  }

  if (type === 'number') {
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(
        `Environment variable ${variableName} is not a valid number`,
      );
    }
    return num;
  } else if (type === 'enum') {
    if (!enumValues || !enumValues.includes(value)) {
      throw new Error(
        `Environment variable ${variableName} must be one of: ${enumValues?.join(', ')}`,
      );
    }
    return value;
  } else if (type === 'boolean') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    throw new Error(
      `Environment variable ${variableName} must be 'true' or 'false'`,
    );
  } else if (type === 'string') {
    return value;
  } else {
    throw new Error(
      `Unsupported type ${type} for environment variable ${variableName}. Cannot start server.`,
    );
  }
}

function loadEnvConfig() {
  const node_env = requireEnvVariable('NODE_ENV', 'enum', [
    NodeEnv.Development,
    NodeEnv.Production,
    NodeEnv.Test,
  ]) as NodeEnv;
  const host = requireEnvVariable('HOST', 'string') as string;
  const port = requireEnvVariable('PORT', 'number') as number;

  const databaseUrl = requireEnvVariable('DATABASE_URL', 'string') as string;
  const jwtSecret = requireEnvVariable('JWT_SECRET', 'string') as string;

  const seed_data = requireEnvVariable('SEED_DATA', 'boolean') as boolean;

  return {
    node_env,
    host,
    port,
    databaseUrl,
    jwtSecret,
    seed_data,
  };
}

export default loadEnvConfig;
