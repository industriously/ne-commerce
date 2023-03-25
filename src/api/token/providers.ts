import { ITokenService } from '@INTERFACE/token';
import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServiceFactory } from './application/token.service';
import { TokenServiceToken } from './constants';

const TokenService: Provider<ITokenService> = {
  provide: TokenServiceToken,
  inject: [JwtService],
  useFactory: TokenServiceFactory,
};

export const providers: Provider[] = [TokenService];
