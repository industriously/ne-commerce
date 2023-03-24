import { UserSchema } from '@INTERFACE/user';
import { SeedUser } from 'src/api/__tests__/seed/user';
import { IConnection } from '@nestia/fetcher';
import { TokenServiceFactory } from '@TOKEN';
import { jwtService } from 'src/api/__tests__/mock/provider';
import { refresh } from './refresh';

export namespace TestAuth {
  const tokenService = TokenServiceFactory(jwtService);

  const invalid_tokens = [
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImludmFsaWRfaWQiLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.xz9-9NWa0Sorkil-g_S-CYauW13H83RaM96wVQZDMHROoyAUTO7251fLNZg5CfwvawOlL3csqDq5lR3vnoovHQ1eXIVXECUfy9JbjmQa6OQPCwrmGFmMb_ZvQk2qc_0niAxSZ0rkKQULLDkvBh0UZfUxKgifX9f8XNSnnZZqqBdwRoAAEYxzJ2fBqkLLtsxQR-WedYj38pgyOmCz5LL7BtZ3TndWvwy8FpniP4T91WEhQfhriBVW5jAKUwdXuNlN5D9lVIFLCM0uGHwVdIIHfpqHjo6c6kB2PcFD3LoVsWuEQC1P79j0BZ44muqXyKsaZq3RE3jIi2AZa1XDRgrLaQ',
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImludmFsaWRfaWQiLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.cjh04Izf55HdQY-Wseam08C1p3XvDN_1GgqvUhZVBavDrghKbOqxDQHEkJk56vRJrqJipCQBTEtP14sEHcPf0wnZI14lKmUlcfw35i9K876CLr9nmPBqiiRwGLfjV__rcwGhmHw1eAJCyeRN3DE6D5gBvpl1N2r2ixqIDUwIiyir_5DnHVIrSxkJssQgWh9eUC6uyQGbMAz5VV8Vu7oUk41Ilym2kwCVc9a1pX56dDW75eWrPtuf6ry4gyVLFvqlNe7W4h2o9nrvMmKDzqNKgZO08-DYcwPZftB-pO9kH52SrGarhuXcMWB3II9LM5_bGRY6dG1oFOwKRhTMFkw32A',
  ];

  export const test_refresh = (connection: IConnection) => () => {
    it.each(invalid_tokens)(
      'If token invalid',
      refresh.test_invalid_token(connection),
    );

    it.each(
      ['182ea22d-88f4-442b-a889-932132cf40a0', SeedUser.inActive_id].map((id) =>
        tokenService.getRefreshToken({ id } as UserSchema.Aggregate),
      ),
    )('If user not exist', refresh.test_user_not_exist(connection));

    it.each(
      [SeedUser.vender_id, SeedUser.normal_id].map((id) =>
        tokenService.getRefreshToken({ id } as UserSchema.Aggregate),
      ),
    )('If user exist', refresh.test_success(connection));
  };
}
