import { jwtAuth } from '../../infra/auth/jwt';
import type { ApiResponse } from '../../shared/models/api-response';
import { app } from '../../server';
import bcrypt from 'bcrypt';
import type { LoginModel, RegisterModel, RequestUser } from './model';

export const repository = {
  async register(data: RegisterModel): Promise<ApiResponse> {
    try {
      const emailExists = await app.prisma.users.findFirst({
        where: {
          email: data.email,
        },
      });

      if (emailExists) {
        return {
          status: 409,
          error: 'email already in use',
        };
      }

      const usernameExists = await app.prisma.users.findFirst({
        where: {
          username: data.username,
        },
      });

      if (usernameExists) {
        return {
          status: 409,
          error: 'username already in use',
        };
      }

      const password_hash = bcrypt.hashSync(data.password, 10);

      const user = await app.prisma.users.create({
        data: {
          username: data.username,
          email: data.email,
          password_hash,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
        },
      });

      return {
        status: 201,
        message: 'user created',
        data: user,
      };
    } catch (err) {
      app.log.error(err);
      return {
        status: 500,
        error: 'internal server error',
      };
    }
  },

  async login(data: LoginModel): Promise<ApiResponse> {
    try {
      const user = await app.prisma.users.findUnique({
        where: {
          email: data.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          password_hash: true,
          role: true,
        },
      });

      if (!user) {
        return {
          status: 404,
          error: 'user not found',
        };
      }

      if (
        data.password !== user.password_hash &&
        !bcrypt.compareSync(data.password, user.password_hash)
      ) {
        return {
          status: 401,
          error: 'invalid credentials',
        };
      }

      const token = jwtAuth.generate({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      return {
        status: 200,
        data: token,
      };
    } catch (err) {
      app.log.error(err);
      return {
        status: 500,
        error: 'internal server error',
      };
    }
  },

  async profile(data: RequestUser): Promise<ApiResponse> {
    try {
      const user = await app.prisma.users.findUnique({
        where: {
          id: data.id,
          username: data.username,
          email: data.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
        },
      });

      if (!user) {
        return {
          status: 404,
          error: 'user not found',
        };
      }

      return {
        status: 200,
        message: 'success',
        data: user,
      };
    } catch (err) {
      app.log.error(err);
      return {
        status: 500,
        error: 'internal server error.',
      };
    }
  },
};
