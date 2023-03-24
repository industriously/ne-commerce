import { IUserUsecase, UserSchema } from '@INTERFACE/user';
import { IConnection } from '@nestia/fetcher';
import { TokenServiceFactory } from '@TOKEN';
import { getProfile } from './get_profile';
import { updateProfile } from './update_profile';
import { inActivate } from './inactivate';
import typia from 'typia';
import { jwtService } from 'src/api/__tests__/mock/provider';
import { SeedUser } from 'src/api/__tests__/seed';
import { prisma } from '@INFRA/DB';

export namespace TestUser {
  const tokenService = TokenServiceFactory(jwtService);
  const invalid_tokens = [
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImludmFsaWRfaWQiLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.xz9-9NWa0Sorkil-g_S-CYauW13H83RaM96wVQZDMHROoyAUTO7251fLNZg5CfwvawOlL3csqDq5lR3vnoovHQ1eXIVXECUfy9JbjmQa6OQPCwrmGFmMb_ZvQk2qc_0niAxSZ0rkKQULLDkvBh0UZfUxKgifX9f8XNSnnZZqqBdwRoAAEYxzJ2fBqkLLtsxQR-WedYj38pgyOmCz5LL7BtZ3TndWvwy8FpniP4T91WEhQfhriBVW5jAKUwdXuNlN5D9lVIFLCM0uGHwVdIIHfpqHjo6c6kB2PcFD3LoVsWuEQC1P79j0BZ44muqXyKsaZq3RE3jIi2AZa1XDRgrLaQ',
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImludmFsaWRfaWQiLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.cjh04Izf55HdQY-Wseam08C1p3XvDN_1GgqvUhZVBavDrghKbOqxDQHEkJk56vRJrqJipCQBTEtP14sEHcPf0wnZI14lKmUlcfw35i9K876CLr9nmPBqiiRwGLfjV__rcwGhmHw1eAJCyeRN3DE6D5gBvpl1N2r2ixqIDUwIiyir_5DnHVIrSxkJssQgWh9eUC6uyQGbMAz5VV8Vu7oUk41Ilym2kwCVc9a1pX56dDW75eWrPtuf6ry4gyVLFvqlNe7W4h2o9nrvMmKDzqNKgZO08-DYcwPZftB-pO9kH52SrGarhuXcMWB3II9LM5_bGRY6dG1oFOwKRhTMFkw32A',
  ];
  const not_exist_user_valid_token = new Array(5)
    .fill(1)
    .map(typia.createRandom<UserSchema.Aggregate>())
    .map((agg) =>
      tokenService.getAccessToken(agg as unknown as UserSchema.Aggregate),
    );
  const getToken = (user: SimpleUser): string => {
    return tokenService.getAccessToken(user as UserSchema.Aggregate);
  };
  type SimpleUser = { id: string; role: UserSchema.Role };

  export const test_get_profile = (connection: IConnection) => () => {
    it.each(invalid_tokens)(
      'If token invalid',
      getProfile.test_invalid_token(connection),
    );

    it.each(
      (
        [
          { id: SeedUser.vender_id, role: 'vender' },
          { id: SeedUser.normal_id, role: 'normal' },
        ] as SimpleUser[]
      ).map(getToken),
    )(
      'If user exist',

      getProfile.test_success(connection),
    );

    it.each(not_exist_user_valid_token)(
      'If user not exist',
      getProfile.test_user_not_found(connection),
    );
  };

  export const test_update_profile = (connection: IConnection) => () => {
    const test_bodys = typia.random<IUserUsecase.UpdateData[]>();
    const _token = getToken({ id: SeedUser.normal_id, role: 'normal' });
    it.each(invalid_tokens)('If token invalid', (token) =>
      updateProfile.test_invalid_token(connection)(token)(test_bodys[0]),
    );

    it.each(not_exist_user_valid_token)('If user not exist', (token) =>
      updateProfile.test_success(connection)(token)(test_bodys[0]),
    );

    it.each(test_bodys)('If user exist', async (body) => {
      await updateProfile.test_success(connection)(_token)(body);

      const received = await SeedUser.getUser(SeedUser.normal_id);

      for (const [key, value] of Object.entries(body)) {
        if (value !== undefined)
          expect(received[key as keyof IUserUsecase.UpdateData]).toBe(value);
      }
    });
  };

  export const test_user_inactivate = (connection: IConnection) => () => {
    it.each(invalid_tokens)(
      'If token invalid',
      inActivate.test_invalid_token(connection),
    );

    it.each<SimpleUser>([
      { id: SeedUser.vender_id, role: 'vender' },
      { id: SeedUser.normal_id, role: 'normal' },
    ])('If token valid', async (user) => {
      const token = getToken(user);
      await inActivate.test_success(connection)(token);

      const received = await prisma.user.findUniqueOrThrow({
        where: { id: user.id },
      });

      expect(received.is_deleted).toBe(true);

      await prisma.user.update({
        where: { id: user.id },
        data: { is_deleted: false },
      });
    });
  };
}
