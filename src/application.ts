import { prisma } from '@INFRA/DB';
import { NestFactory } from '@nestjs/core';
import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { LoggerServiceToken } from '@INFRA/logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { Configuration } from '@INFRA/config';
import { DynamicModule } from '@nestia/core';
import { InfrastructureModule } from './infrastructure';

export const bootstrap = async (
  options: NestApplicationOptions,
): Promise<INestApplication> => {
  const app = await NestFactory.create(
    await DynamicModule.mount(`${__dirname}/api/controller`, {
      imports: [InfrastructureModule],
    }),
    options,
  );
  if (options.logger !== false) app.useLogger(app.get(LoggerServiceToken));

  await prisma.$connect();

  process.on('SIGINT', async () => {
    await close(app);
    process.exit(0);
  });

  return app
    .use(cookieParser())
    .use(helmet({ contentSecurityPolicy: true, hidePoweredBy: true }));
};

export const listen = (
  app: INestApplication,
  port: string | number = Configuration.PORT,
) => {
  return app.listen(port, () => {
    process.send ? process.send('ready') : undefined;
  });
};

export const close = async (app: INestApplication): Promise<void> => {
  await app.close();
  await prisma.$disconnect();
};
