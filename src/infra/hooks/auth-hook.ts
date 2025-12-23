import type { FastifyReply, FastifyRequest } from 'fastify';
import { jwtAuth } from '../auth/jwt';

export async function authHook(
  req: FastifyRequest,
  res: FastifyReply,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send({
      status: 401,
      error: 'Missing authorization header',
    });
    return;
  }

  const cleanToken = authHeader.replace('Bearer ', '');
  if (cleanToken == '') {
    res.status(400).send({
      status: 400,
      error: 'Invalid Authorization header format',
    });
    return;
  }

  const payload = jwtAuth.verify(cleanToken);
  if (!payload) {
    res.status(401).send({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  }

  req.user = {
    id: payload.id,
    email: payload.email,
    username: payload.username,
  };
}
