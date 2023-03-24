import { IConnection } from '@nestia/fetcher';
import { INestApplication } from '@nestjs/common';
import { TestUsers } from '@USER/__tests__/users';
import { TestUser } from '@USER/__tests__/user';
import { TestAuth } from '@USER/__tests__/auth';
import { bootstrap, close, listen } from 'src/application';
import { Configuration } from '@INFRA/config';
import { prisma } from '@INFRA/DB';
import { SeedUser } from './seed';

describe('API Test', () => {
  const connection = {
    host: `http://localhost:${Configuration.PORT}`,
  } satisfies IConnection;

  let app: INestApplication;

  beforeAll(async () => {
    app = await bootstrap({ logger: false });
    await SeedUser.seed();
    await listen(app);
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    if (app) await close(app);
  });

  describe('AuthUsecase', () => {
    describe(
      'token.refresh.refreshToken - get access_token by refresh_token',
      TestAuth.test_refresh(connection),
    );
  });

  describe('UserUsecase', () => {
    describe(
      "users.getPublicProfile - get activate user's public profile by user_id",
      TestUsers.test_get_public_profile(connection),
    );

    describe(
      "user.getProfile - get user's detail profile by access_token",
      TestUser.test_get_profile(connection),
    );

    describe(
      'user.updateProfile - update user profile by access_token',
      TestUser.test_update_profile(connection),
    );

    describe(
      'user.inActivate - remove user by access_token',
      TestUser.test_user_inactivate(connection),
    );
  });
});
