export const ENV_DEVELOPMENT = 'development';
export const ENV_PRODUCTION = 'production';
export const ENV_STAGING = 'staging';

export const ENV = {
  isStaging: process.env.NEXT_PUBLIC_APP_MODE === ENV_STAGING,
  isProduction: process.env.NEXT_PUBLIC_APP_MODE === ENV_PRODUCTION,
  isDevelopment: process.env.NEXT_PUBLIC_APP_MODE === ENV_DEVELOPMENT,

  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  appMode: process.env.NEXT_PUBLIC_APP_MODE,
  liveKitUrl: process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL,
};
