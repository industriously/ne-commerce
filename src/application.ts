import { NestFactory } from '@nestjs/core';
import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerServiceToken } from '@INFRA/logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

export const bootstrap = async (
  options: NestApplicationOptions,
): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule, options);

  if (options.logger !== false) app.useLogger(app.get(LoggerServiceToken));

  return app
    .enableShutdownHooks()
    .use(cookieParser())
    .use(helmet({ contentSecurityPolicy: true, hidePoweredBy: true }));
};

export const listen = (
  app: INestApplication,
  port: string | number = process.env.PORT,
) => {
  return app.listen(port, () => {
    process.send ? process.send('ready') : undefined;
  });
};

export class Server {
  private application?: INestApplication;

  private async init(
    options: NestApplicationOptions,
  ): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule, options);

    if (options.logger !== false) app.useLogger(app.get(LoggerServiceToken));

    return app
      .enableShutdownHooks()
      .use(cookieParser())
      .use(helmet({ contentSecurityPolicy: true, hidePoweredBy: true }));
  }

  async start(options: NestApplicationOptions) {
    if (this.application) {
      await this.application.close();
    }
    this.application = await this.init(options);

    await this.application.listen(process.env.PORT, () => {
      process.send ? process.send('ready') : undefined;
    });
  }
}
