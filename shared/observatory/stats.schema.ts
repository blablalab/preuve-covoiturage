export const alias = 'observatory.stats';
export const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    tz: { type: 'string' }, // TODO : create a timezone macro
  },
};

export const binding = [alias, schema];