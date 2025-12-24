import { ApiResponse } from '../../shared/models/api-response';
import { CreatePaymentModel } from './model';
import { repository } from './repository';

export const service = {
  async create(
    seller_id: string,
    data: CreatePaymentModel,
  ): Promise<ApiResponse> {
    return repository.create(seller_id, data);
  },

  async getAll(seller_id: string): Promise<ApiResponse> {
    return repository.getAll(seller_id);
  },

  async getByPublicID(public_id: string): Promise<ApiResponse> {
    return repository.getByPublicID(public_id);
  },

  async getByID(seller_id: string, id: number): Promise<ApiResponse> {
    return repository.getByID(seller_id, id);
  },

  async deleteByID(seller_id: string, id: number): Promise<ApiResponse> {
    return repository.deleteByID(seller_id, id);
  },
};
