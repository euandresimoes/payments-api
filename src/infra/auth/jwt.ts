import jwt from 'jsonwebtoken';

type Payload = {
  id: string;
  email: string;
  username: string;
  role: string;
};

const secret = `${process.env.JWT_SECRET}`;

export const jwtAuth = {
  generate(payload: Payload): string {
    try {
      return jwt.sign(payload, secret, {
        subject: String(payload.id),
        issuer: 'payments-backend',
        expiresIn: '1h',
      });
    } catch (err) {
      throw err;
    }
  },

  verify(token: string): jwt.JwtPayload {
    try {
      return jwt.verify(token, secret, {
        issuer: 'payments-backend',
      }) as jwt.JwtPayload;
    } catch (err) {
      throw err;
    }
  },
};
