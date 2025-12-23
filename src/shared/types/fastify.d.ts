import type { PrismaClient } from '../../../generated/prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      username: string;
      role: string;
    };
  }
}
