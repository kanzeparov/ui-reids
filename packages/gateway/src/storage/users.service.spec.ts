import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { Repository } from "typeorm";

describe("UsersService", () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(User);
    const module = await Test.createTestingModule({
      providers: [
        { provide: repositoryToken, useClass: class {} },
        UsersService
      ]
    }).compile();

    usersRepository = module.get<Repository<User>>(repositoryToken);
    usersService = module.get<UsersService>(UsersService);
  });

  describe("#findByCredentials", () => {
    it("find by login and password", async () => {
      const expectedUser = new User();
      usersRepository.findOne = jest.fn(async () => expectedUser);
      const user = await usersService.findByCredentials("login", "password");
      expect(usersRepository.findOne).toBeCalledWith({
        login: "login",
        password:
          "8f0082e92cad81938438aeb0abbe09ffb7b28f1b90fb53365862f837fe6d7345"
      });
      expect(user).toBe(expectedUser);
    });
  });

  describe("#refreshToken", () => {
    it("update token", async () => {
      const user = new User();
      const tokenBefore = user.token;
      usersRepository.save = jest.fn();
      await usersService.refreshToken(user);
      expect(user.token).not.toEqual(tokenBefore);
      expect(usersRepository.save).toBeCalledWith(user);
    });
  });

  describe("#findByToken", () => {
    it("should find by token", async () => {
      const expectedUser = new User();
      usersRepository.findOne = jest.fn(async () => expectedUser);
      const user = await usersService.findByToken("super-secret-token");
      expect(usersRepository.findOne).toBeCalledWith({
        token: "super-secret-token"
      });
      expect(user).toBe(expectedUser);
    });
  });
});
