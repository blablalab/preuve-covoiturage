// $schema: 'http://json-schema.org/draft-07/schema#',
// $id: 'https://geojson.org/schema/MultiPolygon.json',
// title: 'GeoJSON MultiPolygon',

export const MultiPolygonSchema = {
  type: 'object',
  required: ['type', 'coordinates'],
  properties: {
    type: {
      type: 'string',
      enum: ['MultiPolygon'],
    },
    coordinates: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'array',
          minItems: 4,
          items: {
            type: 'array',
            minItems: 2,
            items: {
              type: 'number',
            },
          },
        },
      },
    },
    bbox: {
      type: 'array',
      minItems: 4,
      items: {
        type: 'number',
      },
    },
  },
};
