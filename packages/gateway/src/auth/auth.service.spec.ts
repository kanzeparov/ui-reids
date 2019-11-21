import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../storage/users.service';
import { User } from '../storage/user.entity';

describe(AuthService, () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: UsersService, useClass: class {} }, AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('#findByCredentials', () => {
    it('find by username and password', async () => {
      const expected = new User();
      usersService.findByCredentials = jest.fn(async () => expected);
      usersService.refreshToken = jest.fn();
      const user = await authService.byCredentials('username', 'password');
      expect(usersService.findByCredentials).toBeCalledWith('username', 'password');
      expect(usersService.refreshToken).toBeCalled();
      expect(user).toBe(expected);
    });
  });

  describe('#byToken', () => {
    it('find by token', async () => {
      const expected = new User();
      usersService.findByToken = jest.fn(async () => expected);
      const user = await authService.byToken('token');
      expect(usersService.findByToken).toBeCalledWith('token');
      expect(user).toBe(expected);
    });
  });
});
