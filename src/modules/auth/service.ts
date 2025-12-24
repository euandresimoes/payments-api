import type { ApiResponse } from '../../shared/models/api-response';
import { RequestUser } from '../../shared/models/request-user';
import type { LoginModel, RegisterModel } from './model';
import { repository } from './repository';

export const service = {
  async register(data: RegisterModel): Promise<ApiResponse> {
    return repository.register(data);
  },

  async login(data: LoginModel): Promise<ApiResponse> {
    return repository.login(data);
  },

  async profile(data: RequestUser): Promise<ApiResponse> {
    return repository.profile(data);
  },
};
