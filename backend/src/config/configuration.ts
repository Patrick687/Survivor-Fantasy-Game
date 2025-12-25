export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface AppConfig {
  nodeEnv: NodeEnv;
  host: string;
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  // Add more fields as needed
}

// Generic env getter with type and fallback support
function getEnv<T = string>(key: string, fallback?: T): T {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value as unknown as T;
}

export default (): AppConfig => {
  const nodeEnvRaw = getEnv<string>('NODE_ENV');
  if (!Object.values(NodeEnv).includes(nodeEnvRaw as NodeEnv)) {
    throw new Error(
      `NODE_ENV must be one of: ${Object.values(NodeEnv).join(', ')}`,
    );
  }
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
  if (jwtExpiresIn === undefined || jwtExpiresIn === '') {
    throw new Error('Missing required environment variable: JWT_EXPIRES_IN');
  }
  return {
    nodeEnv: nodeEnvRaw as NodeEnv,
    host: getEnv('HOST'),
    port: getEnv<number>('PORT'),
    databaseUrl: getEnv('DATABASE_URL'),
    jwtSecret: getEnv('JWT_SECRET'),
    jwtExpiresIn,
  };
};
