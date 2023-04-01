export interface IEnv {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly PORT: string | number;

  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly GOOGLE_OAUTH_CALLBACK: string;

  readonly GITHUB_CLIENT_ID: string;
  readonly GITHUB_CLIENT_SECRET: string;
  readonly GITHUB_OAUTH_CALLBACK: string;

  readonly ACCESS_TOKEN_PRIVATE_KEY: string;
  readonly ACCESS_TOKEN_PUBLIC_KEY: string;
  readonly REFRESH_TOKEN_PRIVATE_KEY: string;
  readonly REFRESH_TOKEN_PUBLIC_KEY: string;
}
