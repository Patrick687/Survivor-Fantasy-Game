export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export default () => {
  const nodeEnv = process.env.NODE_ENV as NodeEnv | undefined;
  const host = process.env.HOST;
  const port = process.env.PORT;
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!nodeEnv) {
    throw new Error('Missing required environment variable: NODE_ENV');
  }
  if (!Object.values(NodeEnv).includes(nodeEnv)) {
    throw new Error('NODE_ENV must be one of: development, production, test');
  }
  if (!host) {
    throw new Error('Missing required environment variable: HOST');
  }
  if (!port) {
    throw new Error('Missing required environment variable: PORT');
  }
  const portNumber = Number(port);
  if (isNaN(portNumber)) {
    throw new Error('PORT must be a valid number');
  }

  if (!databaseUrl) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }

  if (!jwtSecret) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  if (!jwtExpiresIn) {
    throw new Error('Missing required environment variable: JWT_EXPIRES_IN');
  }

  return {
    nodeEnv,
    host,
    port: portNumber,
    databaseUrl,
    jwtSecret,
    jwtExpiresIn,
  };
};
