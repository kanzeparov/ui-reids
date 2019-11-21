import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../storage/user.entity';
import { BearerStrategy } from './bearer.strategy';
import { LoggerService } from '../common/logger.service';

describe(BearerStrategy.name, () => {
  let bearerStrategy: BearerStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: AuthService, useClass: class {} }, LoggerService, BearerStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    bearerStrategy = module.get<BearerStrategy>(BearerStrategy);
  });

  describe('#validate', () => {
    it('auth by token', async () => {
      const expected = new User();
      authService.byToken = jest.fn(async () => expected);
      const actual = await bearerStrategy.validate('token');
      expect(authService.byToken).toHaveBeenCalledWith('token');
      expect(actual).toBe(expected);
    });
  });
});
