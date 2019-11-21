import { Controller, Request, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../storage/user.entity";

export interface ISessionRequest extends Request {
  user: User;
}

@Controller("session")
export class SessionController {
  @UseGuards(AuthGuard("local"))
  @Post("new")
  async login(@Request() req: ISessionRequest) {
    return req.user;
  }
}
