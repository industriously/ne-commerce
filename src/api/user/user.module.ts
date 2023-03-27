import { Module } from '@nestjs/common';
import {
  GithubStrategy,
  GithubStrategyToken,
  GoogleStrategy,
  GoogleStrategyToken,
} from './_auth_';

@Module({
  providers: [
    {
      useClass: GoogleStrategy,
      provide: GoogleStrategyToken,
    },
    {
      useClass: GithubStrategy,
      provide: GithubStrategyToken,
    },
  ],
})
export class UserModule {}
