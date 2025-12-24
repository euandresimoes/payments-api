import type { FastifyInstance } from 'fastify';
import { service } from './service';
import { authHook } from '../../infra/hooks/auth-hook';
import {
  LoginSchema,
  RegisterSchema,
  type LoginModel,
  type RegisterModel,
} from './model';
import { RequestUser } from '../../shared/models/request-user';
import { ApiResponseSchema } from '../../shared/models/api-response';

export async function authHandler(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        body: RegisterSchema,
        response: {
          201: ApiResponseSchema,
          409: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const data = req.body as RegisterModel;

      const result = await service.register(data);
      return res.status(result.status).send(result);
    },
  );

  app.post(
    '/login',
    {
      schema: {
        body: LoginSchema,
        response: {
          200: ApiResponseSchema,
          404: ApiResponseSchema,
          401: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const data = req.body as LoginModel;

      const result = await service.login(data);
      return res.status(result.status).send(result);
    },
  );

  app.get(
    '/profile',
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
          404: ApiResponseSchema,
          500: ApiResponseSchema,
        } as Record<string, typeof ApiResponseSchema>,
      },
    },
    async function (req, res) {
      const data = req.user as RequestUser;

      const result = await service.profile(data);
      return res.status(result.status).send(result);
    },
  );
}
