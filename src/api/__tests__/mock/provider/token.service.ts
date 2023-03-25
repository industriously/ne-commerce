import { JwtService } from '@nestjs/jwt';
import { TokenServiceFactory } from '@TOKEN';

const jwtService = new JwtService({
  signOptions: { algorithm: 'RS256' },
});

export const tokenService = TokenServiceFactory(jwtService);
