import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../storage/user.entity';
import { LocalStrategy } from './local.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { LoggerService } from '../common/logger.service';

describe(LocalStrategy.name, () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: AuthService, useClass: class {} }, LoggerService, LocalStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  describe('#validate', () => {
    it('authenticate by username, password', async () => {
      const expected = new User();
      expected.token = 'token';
      authService.byCredentials = jest.fn(async () => expected);
      const response = await localStrategy.validate('username', 'password');
      expect(authService.byCredentials).toHaveBeenCalledWith('username', 'password');
      expect(response.token).toEqual(expected.token);
    });

    it('throw if no user', async () => {
      authService.byCredentials = jest.fn(async () => undefined);
      await expect(localStrategy.validate('username', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });
});
