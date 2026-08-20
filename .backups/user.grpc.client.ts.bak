import {
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  UserServiceClient,
  User,
  UserServiceGetByIdRequest,
} from '@ecommerce/contracts/generated/ecommerce/user/v1/user';

import { callGrpc } from '@ecommerce/common'

@Injectable()
export class UserGrpcClient implements OnModuleInit {
  private userService!: UserServiceClient;

  constructor(
    @Inject('USER_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService =
      this.client.getService<UserServiceClient>('UserService');
  }

  async getById(id: number): Promise<User> {
    console.log(
      'USER GRPC CLIENT - calling getById:',
      id,
    );

    const request: UserServiceGetByIdRequest = {
      id,
    };

    const response = await callGrpc(
      this.userService.getById(request),
      {
        source: 'user-service.UserService',
        timeoutMs: 5000,
      },
    );

    console.log(
      'USER GRPC CLIENT - response:',
      response,
    );

    if (!response.user) {
      throw new Error(`User ${id} was not found`);
    }

    return response.user;
  }
}