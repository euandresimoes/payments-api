export type ApiResponse = {
  status: number;
  error?: any;
  message?: string;
  data?: any;
};

export const ApiResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'number', example: 200 },
    message: { type: 'string', nullable: true },
    error: { type: 'string', nullable: true },
    data: {
      type: ['object', 'array', 'string', 'number', 'boolean', 'null'],
      additionalProperties: true,
    },
  },
  required: ['status'],
};
