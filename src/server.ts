import Fastify from 'fastify';
import { prismaPlugin } from './infra/db/database';
import { authHandler } from './modules/auth/handler';
import { paymentLinkHandler } from './modules/payment-link/handler';
import swagger from '@fastify/swagger';
import scalar from '@scalar/fastify-api-reference';

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
// Swagger
app.register(swagger, {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Payments API',
      version: '1.0.0',
    },
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [{ BearerAuth: [] }],
  },
} as any);

// Scalar API
app.register(scalar, {
  routePrefix: '/docs',
  configuration: {
    theme: 'deepSpace',
    layout: 'modern',
  },
});

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
app.register(paymentLinkHandler, { prefix: '/payment-link' });

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
