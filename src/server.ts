import Fastify from 'fastify';
import { prismaPlugin } from './infra/db/database';
import { authHandler } from './modules/auth/handler';

//
// Create Fastify instance
//
export const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  },
});

//
// Plugins
//
// Prisma
app.register(prismaPlugin);

//
// Routes
//
app.get('/health', function (req, res) {
  res.send({
    status: 200,
    message: 'Ping!',
  });
});

app.register(authHandler, { prefix: '/auth' });

//
// Init Fastify
//
async function start() {
  app.listen({ port: 3000 }, function (err, addr) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    app.log.info(`Server is now listening on ${addr}`);
  });
}

start();
