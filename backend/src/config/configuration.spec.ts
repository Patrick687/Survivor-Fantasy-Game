import configuration from './configuration';

describe('configuration', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  const setEnv = (env: Partial<NodeJS.ProcessEnv>) => {
    process.env = { ...process.env, ...env };
  };

  describe('Required environment variables', () => {
    beforeEach(() => {
      setEnv({ NODE_ENV: 'development', HOST: 'localhost', PORT: '3000' });
    });

    describe('NODE_ENV', () => {
      it('should throw if NODE_ENV is missing', () => {
        setEnv({ NODE_ENV: '' });
        expect(() => configuration()).toThrow();
      });

      ['development', 'production', 'test'].forEach((env) => {
        it(`should accept if NODE_ENV is '${env}'`, () => {
          setEnv({ NODE_ENV: env });
          expect(() => configuration()).not.toThrow();
        });
      });

      it('should throw if NODE_ENV is invalid', () => {
        setEnv({ NODE_ENV: 'invalid_env' });
        expect(() => configuration()).toThrow(
          'NODE_ENV must be one of: development, production, test',
        );
      });
    });

    describe('HOST', () => {
      it('should accept valid HOST', () => {
        setEnv({ HOST: 'localhost' });
        expect(() => configuration()).not.toThrow();
      });
      it('should throw if HOST is missing', () => {
        setEnv({ HOST: '' });
        expect(() => configuration()).toThrow(
          'Missing required environment variable: HOST',
        );
      });
    });

    describe('PORT', () => {
      it('should accept valid PORT', () => {
        setEnv({ PORT: '8080' });
        expect(() => configuration()).not.toThrow();
      });
      it('should throw if PORT is missing', () => {
        setEnv({ PORT: '' });
        expect(() => configuration()).toThrow(
          'Missing required environment variable: PORT',
        );
      });
      it('should throw if PORT is not a number', () => {
        setEnv({ PORT: 'not_a_number' });
        expect(() => configuration()).toThrow('PORT must be a valid number');
      });
    });
  });
});
