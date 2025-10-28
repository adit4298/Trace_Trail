/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AI_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: 'development' | 'staging' | 'production';
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_LOGGING: string;
  readonly VITE_ENABLE_AI_RECOMMENDATIONS: string;
  readonly VITE_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_TOKEN_EXPIRY_HOURS: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
