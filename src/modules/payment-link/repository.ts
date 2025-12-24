import { app } from '../../server';
import { ApiResponse } from '../../shared/models/api-response';
import { CreatePaymentLinkModel } from './model';

export const repository = {
  async create(
    seller_id: string,
    data: CreatePaymentLinkModel,
  ): Promise<ApiResponse> {
    try {
      const paymentLink = await app.prisma.paymentLink.create({
        data: {
          seller_id: Number(seller_id),
          ...data,
        },
        select: {
          id: true,
          public_id: true,
          seller_id: true,
          title: true,
          description: true,
          image_url: true,
          price_cents: true,
          expires_at: true,
          status: true,
          created_at: true,
        },
      });

      return {
        status: 201,
        message: 'payment link created',
        data: paymentLink,
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        error: 'internal server error.',
      };
    }
  },

  async getAll(seller_id: string): Promise<ApiResponse> {
    try {
      const paymentLinks = await app.prisma.paymentLink.findMany({
        where: {
          seller_id: Number(seller_id),
        },
      });

      return {
        status: 200,
        data: paymentLinks,
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        error: 'internal server error.',
      };
    }
  },

  async getByPublicID(public_id: string): Promise<ApiResponse> {
    try {
      const paymentLink = await app.prisma.paymentLink.findUnique({
        where: {
          public_id,
        },
      });

      if (!paymentLink) {
        return {
          status: 404,
          error: 'payment link not found',
        };
      }

      return {
        status: 200,
        data: paymentLink,
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        error: 'internal server error.',
      };
    }
  },

  async getByID(seller_id: string, id: number): Promise<ApiResponse> {
    try {
      const paymentLink = await app.prisma.paymentLink.findUnique({
        where: {
          id: id,
          seller_id: Number(seller_id),
        },
      });

      if (!paymentLink) {
        return {
          status: 404,
          error: 'payment link not found',
        };
      }

      return {
        status: 200,
        data: paymentLink,
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        error: 'internal server error.',
      };
    }
  },

  async deleteByID(seller_id: string, id: number): Promise<ApiResponse> {
    try {
      const deletedPayment = await app.prisma.paymentLink.delete({
        where: {
          id: id,
          seller_id: Number(seller_id),
        },
        select: {
          id: true,
          public_id: true,
          seller_id: true,
          title: true,
          description: true,
          image_url: true,
          price_cents: true,
          status: true,
          expires_at: true,
          created_at: true,
        },
      });

      return {
        status: 200,
        data: deletedPayment,
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        error: 'internal server error.',
      };
    }
  },
};
