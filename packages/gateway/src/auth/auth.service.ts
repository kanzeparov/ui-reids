import { Injectable } from '@nestjs/common';
import { UsersService } from '../storage/users.service';
import { User } from '../storage/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async byCredentials(username: string, password: string): Promise<User | undefined> {
    const user = await this.usersService.findByCredentials(username, password);
    if (user) {
      await this.usersService.refreshToken(user);
    }
    return user;
  }

  async byToken(token: string): Promise<User | undefined> {
    return this.usersService.findByToken(token);
  }
}
