import { DbContext, makeDbBeforeAfter } from "@/pdc/providers/test/index.ts";
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
import { Id } from "../interfaces/index.ts";
import { insertableCarpool } from "../mocks/database/carpool.ts";
import { insertableAcquisitionStatus } from "../mocks/database/status.ts";
import { CarpoolLookupRepository } from "./CarpoolLookupRepository.ts";
import { CarpoolRepository } from "./CarpoolRepository.ts";
import { CarpoolStatusRepository } from "./CarpoolStatusRepository.ts";

interface TestContext {
  repository: CarpoolLookupRepository;
  statusRepository: CarpoolStatusRepository;
  carpoolRepository: CarpoolRepository;
  db: DbContext;
  carpool_id: Id;
}

const test = anyTest as TestFn<TestContext>;
const { before, after } = makeDbBeforeAfter();

beforeAll(async (t) => {
  const db = await before();
  t.context.db = db;
  t.context.repository = new CarpoolLookupRepository(t.context.db.connection);
  t.context.statusRepository = new CarpoolStatusRepository(
    t.context.db.connection,
  );
  t.context.carpoolRepository = new CarpoolRepository(t.context.db.connection);
  const carpool = await t.context.carpoolRepository.register(insertableCarpool);
  const statusData = {
    ...insertableAcquisitionStatus,
    carpool_id: carpool._id,
  };
  await t.context.statusRepository.saveAcquisitionStatus(statusData);
  t.context.carpool_id = carpool._id;
});

test.after.always(async (t) => {
  await after(t.context.db);
});

it("Should get one carpool status", async (t) => {
  const data = { ...insertableCarpool };
  const { _id, acquisition_status, operator_trip_id } = await t.context
    .repository.findOneStatus(
      data.operator_id,
      data.operator_journey_id,
    );
  assertObjectMatch(
    { _id, acquisition_status, operator_trip_id },
    {
      _id: t.context.carpool_id,
      acquisition_status: insertableAcquisitionStatus.status,
      operator_trip_id: data.operator_trip_id,
    },
  );
});

it("Should get one carpool", async (t) => {
  const data = { ...insertableCarpool };
  const { _id, uuid, created_at, updated_at, ...carpool } = await t.context
    .repository.findOne(
      data.operator_id,
      data.operator_journey_id,
    );
  assertObjectMatch(carpool, {
    ...data,
    fraud_status: "pending",
    acquisition_status: "canceled",
  });
});
