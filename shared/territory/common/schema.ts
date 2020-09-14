import { contacts } from '../../common/schemas/contacts';

const commonFields = {
  name: {},
  shortname: {},
  level: {},
  activable: {},
  ui_status: {},
};

const geoFields = {
  geo: {},
  density: {},
  insee: {},        
  postcode: {},
  children: {},
}

const activeFields = {
  contacts: {},
  activable: {},
  active: {},
  company_id: {},
  address: {},
}

export function schema(alias: string, extrafields: {[k:string]: any} = {}) {
  const extrafieldKeys = Reflect.ownKeys(extrafields);
  return {
    $id: alias,
    allOf: [
      {
        type: 'object',
        required: ['name', 'level', 'activable', ...extrafieldKeys],
        additionalProperties: false,
        properties: {
          ...activeFields,
          ...geoFields,
          ...extrafields,
          name: { macro: 'varchar' },
          shortname: { macro: 'varchar' },
          level: {
            type: 'string',
            enum: ['town', 'towngroup', 'district', 'megalopolis', 'region', 'state', 'country', 'countrygroup', 'other'],
          },
          activable: {
            type: 'boolean',
            default: false,
          },
          ui_status: {
            type: 'object',
          },
        },
      },
      {
        oneOf: [
          {
            type: 'object',
            required: ['activable', 'active', 'company_id', 'contacts', 'address'],
            additionalProperties: false,
            properties: {
              ...commonFields,
              ...geoFields,
              contacts,
              activable: {
                const: true,
              },
              active: {
                type: 'boolean',
                default: false,
              },
              company_id: {
                macro: 'serial',
              },
              address: {
                city: { type: 'string' },
                country: { type: 'string' },
                postcode: { type: 'string' },
                street: { type: 'string' },
              },
            }
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['activable'],
            properties: {
              ...commonFields,
              ...geoFields,
              activable: {
                const: false,
              },
            }
          }
        ]
      },
      {
        oneOf: [
          {
            type: 'object',
            required: ['geo'],
            additionalProperties: false,
            properties: {
              ...commonFields,
              ...activeFields,
              geo: {
                type: 'string',
              },
              density: {
                type: 'integer',
                minimum: 0,
              },
              insee: {
                type: 'array',
                items: { macro: 'insee' },
              },        
              postcode: {
                type: 'array',
                items: { macro: 'postcode' },
              },
            }
          },
          {
            type: 'object',
            required: ['children'],
            additionalProperties: false,
            properties: {
              ...commonFields,
              ...activeFields,
              children: {
                type: 'array',
                items: { macro: 'serial' },
              },
            }
          }
        ],
      },
      
    ],
  };  
}
