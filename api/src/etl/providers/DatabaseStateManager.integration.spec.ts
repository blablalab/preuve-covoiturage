import {
  afterAll,
  afterEach,
  assert,
  assertEquals,
  assertFalse,
  assertObjectMatch,
  assertThrows,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "@/dev_deps.ts";
import { Pool } from "@/deps.ts";
import { StaticMigrable } from "../interfaces/index.ts";
import { createPool } from "../helpers/index.ts";
import { DatabaseStateManager as StateManager } from "./DatabaseStateManager.ts";

interface TestContext {
  connection: Pool;
  migrator: StateManager;
}

const test = anyTest as TestFn<TestContext>;

const FakeMigrable = { uuid: "key", year: 2022 } as unknown as StaticMigrable;

beforeAll(async (t) => {
  t.context.connection = createPool();
  t.context.migrator = new StateManager(t.context.connection, {
    targetSchema: "public",
    datastructures: new Set([FakeMigrable]),
    datasets: new Set([]),
    noCleanup: false,
  });
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.migrator.table}
    `);
});

test.after.always(async (t) => {
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.migrator.table}
    `);
});

it("should install", async (t) => {
  await t.context.migrator.install();
  const query = `SELECT * FROM ${t.context.migrator.table}`;
  t.log(query);
  await t.notThrowsAsync(() => t.context.connection.query(query));
});

it("should set key", async (t) => {
  const state = await t.context.migrator.toMemory();
  state.set(FakeMigrable);
  await t.context.migrator.fromMemory(state);
  const query = `SELECT key FROM ${t.context.migrator.table}`;
  t.log(query);
  const result = await t.context.connection.query(query);
  assertObjectMatch(result.rows, [{ key: "key" }]);
});

it("should do nothing if conflict", async (t) => {
  const state = await t.context.migrator.toMemory();
  state.set(FakeMigrable);
  await t.context.migrator.fromMemory(state);
  const query = `SELECT key FROM ${t.context.migrator.table}`;
  t.log(query);
  const result = await t.context.connection.query(query);
  assertObjectMatch(result.rows, [{ key: "key" }]);
});

it("should get keys", async (t) => {
  const state = await t.context.migrator.toMemory();
  const result = state.get();
  assertObjectMatch(result, new Set([FakeMigrable]));
});
