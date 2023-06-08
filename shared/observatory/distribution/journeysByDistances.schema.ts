import { directionTypes, perimeterTypes } from '../../geo/shared/Perimeter';

export const alias = 'observatory.journeysByDistances';
export const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['year', 'month', 'type', 'code'],
  properties: {
    year: {
      type: 'integer',
      minimum: 2020,
    },
    month: {
      type: 'integer',
      minimum: 1,
      maximum: 12,
    },
    type: {
      type: 'string',
      enum: perimeterTypes,
    },
    code: {
      type: 'string',
      minLength: 2,
      maxLength: 9,
    },
    direction: {
      type: 'string',
      enum: directionTypes,
    },
  },
};

export const binding = [alias, schema];
