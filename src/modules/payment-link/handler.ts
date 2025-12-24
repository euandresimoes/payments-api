import { FastifyInstance } from 'fastify';
import { authHook } from '../../infra/hooks/auth-hook';
import { service } from './service';
import { ApiResponseSchema } from '../../shared/models/api-response';
import { IQuery, IQueryPublicID } from '../../shared/models/query';
import { CreatePaymentLinkModel, CreatePaymentLinkSchema } from './model';

export async function paymentLinkHandler(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: authHook,
      schema: {
        body: CreatePaymentLinkSchema,
        headers: {
          type: 'object',
          properties: {
            Authorization: {
              type: 'string',
            },
          },
          required: ['Authorization'],
        },
        response: {
          201: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const seller_id = req.user!.id as string;
      const data = req.body as CreatePaymentLinkModel;

      const result = await service.create(seller_id, data);
      res.status(result.status).send(result);
    },
  );

  app.get(
    '/',
    {
      preHandler: authHook,
      schema: {
        headers: {
          type: 'object',
          properties: {
            Authorization: {
              type: 'string',
            },
          },
          required: ['Authorization'],
        },
        response: {
          200: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const seller_id = req.user!.id as string;

      const result = await service.getAll(seller_id);
      res.status(result.status).send(result);
    },
  );

  app.get<{ Querystring: IQueryPublicID }>(
    '/public',
    {
      preHandler: authHook,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            public_id: { type: 'string' },
          },
        },
        headers: {
          type: 'object',
          properties: {
            Authorization: {
              type: 'string',
            },
          },
          required: ['Authorization'],
        },
        response: {
          200: ApiResponseSchema,
          404: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const seller_id = req.user!.id as string;
      const { public_id } = req.query;

      const result = await service.getByPublicID(public_id);
      res.status(result.status).send(result);
    },
  );

  app.get<{ Querystring: IQuery }>(
    '/id',
    {
      preHandler: authHook,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
        headers: {
          type: 'object',
          properties: {
            Authorization: {
              type: 'string',
            },
          },
          required: ['Authorization'],
        },
        response: {
          200: ApiResponseSchema,
          404: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const seller_id = req.user!.id as string;
      const { id } = req.query;

      const result = await service.getByID(seller_id, id);
      res.status(result.status).send(result);
    },
  );

  app.delete<{ Querystring: IQuery }>(
    '/id',
    {
      preHandler: authHook,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
        headers: {
          type: 'object',
          properties: {
            Authorization: {
              type: 'string',
            },
          },
          required: ['Authorization'],
        },
        response: {
          200: ApiResponseSchema,
          404: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const seller_id = req.user!.id as string;
      const { id } = req.query;

      const result = await service.deleteByID(seller_id, id);
      res.status(result.status).send(result);
    },
  );
}
