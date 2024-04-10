import { ContextType } from '@ilos/common';
import { PostgresConnection } from '@ilos/connection-postgres';
import { DbContext, HandlerMacroContext, handlerMacro, makeDbBeforeAfter } from '@pdc/providers/test';
import {
  ceeJourneyTypeEnumSchema,
  lastNameTruncSchema,
  phoneTruncSchema,
  timestampSchema,
} from '@shared/cee/common/ceeSchema';
import { ParamsInterface, ResultInterface, handlerConfig } from '@shared/cee/importApplicationIdentity.contract';
import anyTest, { TestFn } from 'ava';
import { ServiceProvider } from '../ServiceProvider';

const { before, after, error } = handlerMacro<ParamsInterface, ResultInterface>(ServiceProvider, handlerConfig);
const { before: dbBefore, after: dbAfter } = makeDbBeforeAfter();

interface TestContext extends HandlerMacroContext {
  db: DbContext;
}

const test = anyTest as TestFn<TestContext>;
test.before(async (t) => {
  const db = await dbBefore();
  const { kernel } = await before();
  kernel
    .getContainer()
    .rebind(PostgresConnection)
    .toConstantValue(new PostgresConnection({ connectionString: db.db.currentConnectionString }));
  t.context = { db, kernel };
});

test.after(async (t) => {
  await after(t.context);
  await dbAfter(t.context.db);
});

const defaultContext: ContextType = {
  call: { user: { permissions: ['test.run'], operator_id: 1 } },
  channel: { service: 'dummy' },
};

const defaultPayload: any = {
  cee_application_type: 'specific',
  identity_key: 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  journey_type: 'short',
  last_name_trunc: 'ABC',
  phone_trunc: '+336273488',
  datetime: '2023-01-02T00:00:00.000Z',
};

test.serial(
  error,
  [],
  (e: any, t) => {
    t.is(e.message, 'Invalid params');
    t.is(e.rpcError?.data[0], ': must NOT have fewer than 1 items');
  },
  defaultContext,
);

test.serial(
  error,
  [{ ...defaultPayload, last_name_trunc: 'abcd' }],
  (e: any, t) => {
    t.is(e.message, 'Invalid params');
    t.is(e.rpcError?.data[0], `/0/last_name_trunc: ${lastNameTruncSchema.errorMessage}`);
  },
  defaultContext,
);

test.serial(
  error,
  [{ ...defaultPayload, journey_type: 'bip' }],
  (e: any, t) => {
    t.is(e.message, 'Invalid params');
    t.is(e.rpcError?.data[0], `/0/journey_type: ${ceeJourneyTypeEnumSchema.errorMessage}`);
  },
  defaultContext,
);

test.serial(
  error,
  [{ ...defaultPayload, datetime: 'bip' }],
  (e: any, t) => {
    t.is(e.message, 'Invalid params');
    t.is(e.rpcError?.data[0], `/0/datetime: ${timestampSchema.errorMessage}`);
  },
  defaultContext,
);

test.serial(
  error,
  [{ ...defaultPayload, phone_trunc: 'bip' }],
  (e: any, t) => {
    t.is(e.message, 'Invalid params');
    t.is(e.rpcError?.data[0], `/0/phone_trunc: ${phoneTruncSchema.errorMessage}`);
  },
  defaultContext,
);

test.serial(error, [defaultPayload], 'Unauthorized Error', { ...defaultContext, call: { user: {} } });
