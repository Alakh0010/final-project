interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  REACT_APP_API_URL: string;
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;
  REACT_APP_SENTRY_DSN?: string;
  REACT_APP_GA_TRACKING_ID?: string;
}

// Default values for development
const defaultConfig: EnvConfig = {
  NODE_ENV: 'development',
  REACT_APP_API_URL: 'http://localhost:5000/api',
  MONGODB_URI: process.env.REACT_APP_MONGODB_URI || 'mongodb+srv://alakh001:Alakh8613@cluster0.haxjqnv.mongodb.net',
  MONGODB_DB_NAME: process.env.REACT_APP_MONGODB_DB_NAME || 'query_resolver',
};

// Create configuration object
export const config = {
  ...defaultConfig,
  ...process.env,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// Validate required environment variables in production
if (config.isProduction) {
  const requiredVars: (keyof EnvConfig)[] = [
    'REACT_APP_API_URL',
    'MONGODB_URI',
    'MONGODB_DB_NAME'
  ];
  
  const missingVars = requiredVars.filter((key) => !config[key]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

export default config;
