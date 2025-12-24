import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { app } from '../../server';
import { CreatePaymentLinkModel } from './model';
import { repository } from './repository';

jest.mock('../../server', () => ({
  app: {
    prisma: {
      paymentLink: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    },
  },
}));

const mockPrismaCreate = app.prisma.paymentLink
  .create as unknown as jest.MockedFunction<any>;

const mockPrismaFindMany = app.prisma.paymentLink
  .findMany as unknown as jest.MockedFunction<any>;

const mockPrismaFindUnique = app.prisma.paymentLink
  .findUnique as unknown as jest.MockedFunction<any>;

const mockPrismaDelete = app.prisma.paymentLink
  .delete as unknown as jest.MockedFunction<any>;

describe('Payment Link Repository - create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 201 when payment link created', async () => {
    const seller_id = '1';

    const payload: CreatePaymentLinkModel = {
      title: 'Test payment link',
      description: 'Test description',
      image_url: 'test_image.jpg',
      price_cents: 135000,
      expires_at: new Date(),
    };

    const prismaResponse = {
      id: 1,
      public_id: 'public-id',
      seller_id: 1,
      title: payload.title,
      description: payload.description,
      image_url: payload.image_url,
      price_cents: payload.price_cents,
      expires_at: payload.expires_at,
      status: 'ACTIVE',
      created_at: new Date(),
    };

    mockPrismaCreate.mockResolvedValue(prismaResponse);

    const result = await repository.create(seller_id, payload);

    expect(app.prisma.paymentLink.create).toHaveBeenCalledWith({
      data: {
        seller_id: 1,
        ...payload,
      },
      select: {
        id: true,
        public_id: true,
        seller_id: true,
        title: true,
        description: true,
        image_url: true,
        price_cents: true,
        expires_at: true,
        status: true,
        created_at: true,
      },
    });

    expect(result).toEqual({
      status: 201,
      message: 'payment link created',
      data: prismaResponse,
    });
  });
});

describe('Payment Link Repository - getAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 when find payment links', async () => {
    const seller_id = '1';

    const prismaResponse = [
      {
        id: 1,
        public_id: 'public-id',
        seller_id: 1,
        title: 'Test title 1',
        description: 'Test description 1',
        image_url: 'payment_link1.jpg',
        price_cents: 320000,
        expires_at: '2025-12-26T15:00:00+00:00',
        status: 'ACTIVE',
        created_at: new Date(),
      },
      {
        id: 2,
        public_id: 'public-id',
        seller_id: 1,
        title: 'Test title 2',
        description: 'Test description 2',
        image_url: 'payment_link2.jpg',
        price_cents: 640000,
        expires_at: '2025-12-22T18:00:00+00:00',
        status: 'EXPIRED',
        created_at: new Date(),
      },
    ];

    mockPrismaFindMany.mockResolvedValue(prismaResponse);

    const result = await repository.getAll(seller_id);

    expect(app.prisma.paymentLink.findMany).toHaveBeenCalledWith({
      where: {
        seller_id: Number(seller_id),
      },
    });
    expect(result).toEqual({
      status: 200,
      data: prismaResponse,
    });
  });
});

describe('Payment Link Repository - getByPublicID', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when payment link not found', async () => {
    const publicID = 'wrong-public-id';

    mockPrismaFindUnique.mockResolvedValue(null);

    const result = await repository.getByPublicID(publicID);

    expect(app.prisma.paymentLink.findUnique).toHaveBeenCalledWith({
      where: {
        public_id: 'wrong-public-id',
      },
    });
    expect(result.status).toBe(404);
    expect(result.error).toBe('payment link not found');
  });

  it('returns 200 when payment link exists', async () => {
    const publicID = 'correct-public-id';

    const prismaResponse = {
      id: 1,
      public_id: 'correct-public-id',
      seller_id: 1,
      title: 'Test title 1',
      description: 'Test description 1',
      image_url: 'payment_link1.jpg',
      price_cents: 320000,
      expires_at: '2025-12-26T15:00:00+00:00',
      status: 'ACTIVE',
      created_at: new Date(),
    };

    mockPrismaFindUnique.mockResolvedValue(prismaResponse);

    const result = await repository.getByPublicID(publicID);

    expect(app.prisma.paymentLink.findUnique).toHaveBeenCalledWith({
      where: {
        public_id: 'correct-public-id',
      },
    });
    expect(result.status).toBe(200);
    expect(result.data).toBe(prismaResponse);
  });
});

describe('Payment Link Repository - getByID', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when payment link not found', async () => {
    const sellerId = '1';
    const id = 5;

    mockPrismaFindUnique.mockResolvedValue(null);

    const result = await repository.getByID(sellerId, id);

    expect(app.prisma.paymentLink.findUnique).toHaveBeenCalledWith({
      where: {
        id: 5,
        seller_id: Number(sellerId),
      },
    });
    expect(result.status).toBe(404);
    expect(result.error).toBe('payment link not found');
  });

  it('returns 200 when payment link exists', async () => {
    const sellerId = '1';
    const id = 5;

    const prismaResponse = {
      id: 5,
      public_id: 'public-id',
      seller_id: 1,
      title: 'Test title 1',
      description: 'Test description 1',
      image_url: 'payment_link1.jpg',
      price_cents: 320000,
      expires_at: '2025-12-26T15:00:00+00:00',
      status: 'ACTIVE',
      created_at: new Date(),
    };

    mockPrismaFindUnique.mockResolvedValue(prismaResponse);

    const result = await repository.getByID(sellerId, id);

    expect(app.prisma.paymentLink.findUnique).toHaveBeenCalledWith({
      where: {
        id: id,
        seller_id: Number(sellerId),
      },
    });
    expect(result.status).toBe(200);
    expect(result.data).toBe(prismaResponse);
  });
});

describe('Payment Link Repository - deleteByID', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 when payment link deleted', async () => {
    const sellerId = '5';
    const id = 12;

    const prismaResponse = {
      id: 12,
      public_id: 'public-id',
      seller_id: 5,
      title: 'Test title 1',
      description: 'Test description 1',
      image_url: 'payment_link1.jpg',
      price_cents: 320000,
      expires_at: '2025-12-26T15:00:00+00:00',
      status: 'ACTIVE',
      created_at: new Date(),
    };

    mockPrismaDelete.mockResolvedValue(prismaResponse);

    const result = await repository.deleteByID(sellerId, id);

    expect(app.prisma.paymentLink.delete).toHaveBeenCalledWith({
      where: {
        id: id,
        seller_id: Number(sellerId),
      },
      select: {
        id: true,
        public_id: true,
        seller_id: true,
        title: true,
        description: true,
        image_url: true,
        price_cents: true,
        status: true,
        expires_at: true,
        created_at: true,
      },
    });
    expect(result.status).toBe(200);
    expect(result.data).toBe(prismaResponse);
  });
});
