import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { repository } from './repository';
import { app } from '../../server';
import bcrypt from 'bcrypt';

jest.mock('../../server', () => ({
  app: {
    prisma: {
      users: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    },
  },
}));

jest.mock('../../infra/auth/jwt', () => ({
  jwtAuth: {
    generate: jest.fn().mockReturnValue('fake-token'),
  },
}));

jest.mock('bcrypt', () => ({
  hashSync: jest.fn(() => 'hashed-password'),
  compareSync: jest.fn(),
}));

const mockPrismaFindUnique = app.prisma.users
  .findUnique as unknown as jest.MockedFunction<any>;

const mockPrismaFindFirst = app.prisma.users
  .findFirst as unknown as jest.MockedFunction<any>;

const mockPrismaCreate = app.prisma.users
  .create as unknown as jest.MockedFunction<any>;

describe('Auth Repository - register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 409 when email already in use', async () => {
    mockPrismaFindFirst.mockResolvedValue({
      id: 1,
    });

    const result = await repository.register({
      username: 'test',
      email: 'test@gmail.com',
      password: '12345',
    });

    expect(result.status).toBe(409);
    expect(result.error).toBe('email already in use');
  });

  it('returns 409 when username already in use', async () => {
    mockPrismaFindFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 1,
      username: 'test',
    });

    const result = await repository.register({
      username: 'test',
      email: 'test2@gmail.com',
      password: '12345',
    });

    expect(result.status).toBe(409);
    expect(result.error).toBe('username already in use');
  });
});

describe('Auth Repository - login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when user is not found', async () => {
    mockPrismaFindUnique.mockResolvedValue(null);

    const result = await repository.login({
      email: 'test@gmail.com',
      password: '12345',
    });

    expect(result.status).toBe(404);
  });

  it('returns 401 if password is incorrect', async () => {
    mockPrismaFindUnique.mockResolvedValue({
      id: 1,
      username: 'test',
      email: 'test@gmail.com',
      password_hash: 'hashed-password',
      role: 'USER',
    });

    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    const result = await repository.login({
      email: 'test@gmail.com',
      password: 'wrong-password',
    });

    expect(result.status).toBe(401);
    expect(result.error).toBe('invalid credentials');
  });
});

describe('Auth Repository - profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when user not found', async () => {
    mockPrismaFindUnique.mockResolvedValue(null);

    const result = await repository.profile({
      id: '1',
      username: 'test',
      email: 'test@gmail.com',
    });

    expect(result.status).toBe(404);
    expect(result.error).toBe('user not found');
  });
});
