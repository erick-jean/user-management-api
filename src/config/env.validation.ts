type EnvVars = {
  DATABASE_URL?: string;
  JWT_SECRET?: string;
  PORT?: string;
};

export function validateEnv(config: EnvVars) {
  if (!config.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return config;
}
