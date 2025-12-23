import fp from 'fastify-plugin';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export const prismaPlugin = fp(async function (fastify, opts) {
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async function (fastifyInstance) {
    await prisma.$disconnect();
  });
});
