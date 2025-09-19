type EnvType = 'string' | 'number' | 'enum';

function requireEnvVariable(
    variableName: string,
    type: EnvType = 'string',
    enumValues?: string[]
): string | number {
    const value = process.env[variableName];
    if (!value) {
        throw new Error(`Environment variable ${variableName} is not set`);
    }

    if (type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`Environment variable ${variableName} is not a valid number`);
        }
        return num;
    }

    if (type === 'enum') {
        if (!enumValues || !enumValues.includes(value)) {
            throw new Error(
                `Environment variable ${variableName} must be one of: ${enumValues?.join(', ')}`
            );
        }
        return value;
    }

    // Default: string
    return value;
}

function loadEnvConfig() {
    const node_env = requireEnvVariable('NODE_ENV', 'enum', [
        'development',
        'production',
        'test',
    ]) as 'development' | 'production' | 'test';
    const host = requireEnvVariable('HOST', 'string') as string;
    const port = requireEnvVariable('PORT', 'number') as number;

    const databaseUrl = requireEnvVariable('DATABASE_URL', 'string') as string;
    const jwtSecret = requireEnvVariable('JWT_SECRET', 'string') as string;

    return {
        node_env,
        host,
        port,
        databaseUrl,
        jwtSecret,
    };
}

export default loadEnvConfig;