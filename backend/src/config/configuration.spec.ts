import config, { NodeEnv, AppConfig } from './configuration';

describe('AppConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  const setAllEnv = () => {
    process.env.NODE_ENV = NodeEnv.Development;
    process.env.HOST = 'localhost';
    process.env.PORT = '3000';
    process.env.DATABASE_URL = 'postgres://...';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_EXPIRES_IN = '1h';
  };

  it('returns config when all envs are set', () => {
    setAllEnv();
    expect(config()).toEqual({
      nodeEnv: NodeEnv.Development,
      host: 'localhost',
      port: '3000',
      databaseUrl: 'postgres://...',
      jwtSecret: 'secret',
      jwtExpiresIn: '1h',
    });
  });

  it('throws if NODE_ENV is missing', () => {
    setAllEnv();
    delete process.env.NODE_ENV;
    expect(() => config()).toThrow(/NODE_ENV/);
  });

  it('throws if NODE_ENV is invalid', () => {
    setAllEnv();
    process.env.NODE_ENV = 'invalid' as any;
    expect(() => config()).toThrow(/NODE_ENV must be one of/);
  });

  it('throws if HOST is missing', () => {
    setAllEnv();
    delete process.env.HOST;
    expect(() => config()).toThrow(/HOST/);
  });

  it('throws if PORT is missing', () => {
    setAllEnv();
    delete process.env.PORT;
    expect(() => config()).toThrow(/PORT/);
  });

  it('throws if DATABASE_URL is missing', () => {
    setAllEnv();
    delete process.env.DATABASE_URL;
    expect(() => config()).toThrow(/DATABASE_URL/);
  });

  it('throws if JWT_SECRET is missing', () => {
    setAllEnv();
    delete process.env.JWT_SECRET;
    expect(() => config()).toThrow(/JWT_SECRET/);
  });

  it('throws if JWT_EXPIRES_IN is missing', () => {
    setAllEnv();
    delete process.env.JWT_EXPIRES_IN;
    expect(() => config()).toThrow(/JWT_EXPIRES_IN/);
  });
});
