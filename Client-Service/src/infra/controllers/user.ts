import { Controller, HttpStatus } from "@nestjs/common";

import { MessagePattern } from "@nestjs/microservices";
import { CreateUserUseCase } from "src/application/use-cases/create";
import { LoginUseCase } from "src/application/use-cases/login";
import { UpdatePermisionUseCase } from "src/application/use-cases/update-permision";

interface ILoginUserServiceReturnData {
  userId: string;
  email: string;
  name: string;
}

interface ICreateUserParams {
  email: string;
  name: string;
  password: string;
}

interface ILoginParams {
  email: string;
  password: string;
}

@Controller("user")
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUseCase: LoginUseCase,
    private updatePermissionUseCase: UpdatePermisionUseCase
  ) {}

  @MessagePattern({ cmd: "user-create" })
  async create({
    email,
    name,
    password,
  }: ICreateUserParams): Promise<{ userId: string }> {
    const user = await this.createUserUseCase.execute({
      email,
      name,
      password,
    });

    return { userId: user.id };
  }

  @MessagePattern({ cmd: "user-login" })
  async login({
    email,
    password,
  }: ILoginParams): Promise<ILoginUserServiceReturnData> {
    const data = await this.loginUseCase.execute({
      email,
      password,
    });

    return data;
  }

  @MessagePattern({ cmd: "update-permission" })
  async updatePermission({
    userId,
    isAdmin,
  }: {
    userId: string;
    isAdmin: boolean;
  }) {
    await this.updatePermissionUseCase.execute({ isAdmin, userId });

    return { message: "Updated sucessfully" };
  }
}
