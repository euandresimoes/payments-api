export type CreatePaymentLinkModel = {
  title: string;
  description: string;
  image_url: string;
  price_cents: number;
  expires_at: Date;
};

export const CreatePaymentLinkSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    image_url: { type: 'string' },
    price_cents: { type: 'number' },
    expires_at: { type: 'string' },
  },
};
