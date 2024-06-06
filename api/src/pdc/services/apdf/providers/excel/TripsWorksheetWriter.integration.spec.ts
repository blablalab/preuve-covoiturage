import { faker } from '@faker-js/faker';
import { anyTest as test } from '@/dev_deps.ts';
import { Row, stream, Workbook, Worksheet } from 'exceljs';
import { APDFTripInterface } from '../../interfaces/APDFTripInterface.ts';
import { BuildExcel } from './BuildExcel.ts';
import { TripsWorksheetWriter } from './TripsWorksheetWriter.ts';

// tool to sort column names to be able to compare them
function sortRowValues(values: Row['values']): Row['values'] {
  if (Array.isArray(values)) return values.sort();
  if ('object' === typeof values) return Object.keys(values).sort();
  return values;
}

let dataWorkBookWriter: TripsWorksheetWriter;

const exportTripInterface: APDFTripInterface = {
  distance: faker.number.int({ min: 1_500, max: 150_000 }),
  driver_operator_user_id: faker.string.uuid().toUpperCase(),
  duration: faker.number.int({ min: 300, max: 3600 }),
  end_datetime: faker.date.future({ years: 2 }).toISOString(),
  end_epci: faker.location.city(),
  end_insee: faker.string.numeric(5),
  end_location: faker.location.city(),
  incentive_type: faker.helpers.arrayElement(['normale', 'booster']),
  operator_class: 'C',
  operator_journey_id: faker.string.uuid().toUpperCase(),
  operator_trip_id: faker.string.uuid().toUpperCase(),
  operator: faker.company.name(),
  passenger_operator_user_id: faker.string.uuid().toUpperCase(),
  rpc_incentive: faker.number.int(1000),
  rpc_journey_id: faker.string.uuid().toUpperCase(),
  start_datetime: faker.date.past({ years: 2 }).toISOString(),
  start_epci: faker.location.city(),
  start_insee: faker.string.numeric(5),
  start_location: faker.location.city(),
};

test.before((t) => {
  dataWorkBookWriter = new TripsWorksheetWriter();
});

test('DataWorkBookWriter: should stream data to a workbook file', async (t) => {
  // Arrange
  const tripCursor = new Promise<APDFTripInterface[]>((resolve, reject) => {
    resolve([
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
      exportTripInterface,
    ]);
  });
  const cursorEndingResult = new Promise<APDFTripInterface[]>((resolve, reject) => {
    resolve([]);
  });
  let counter = 20;
  const cursorCallback = (count: number): Promise<APDFTripInterface[]> => {
    if (counter <= 0) {
      return cursorEndingResult;
    }
    counter = counter - 10;
    return tripCursor;
  };

  const filepath = '/tmp/stream-data-test.xlsx';

  // Act
  const booster_dates = new Set<string>();
  const workbookWriter: stream.xlsx.WorkbookWriter = BuildExcel.initWorkbookWriter(filepath);
  await dataWorkBookWriter.call({ read: cursorCallback, release: async () => {} }, booster_dates, workbookWriter);
  await workbookWriter.commit();

  // Assert
  const workbook: Workbook = await new Workbook().xlsx.readFile(filepath);
  const worksheet: Worksheet = workbook.getWorksheet(dataWorkBookWriter.WORKSHEET_NAME);
  t.is(worksheet.actualRowCount, 21);
  t.deepEqual<Row['values'], Row['values']>(
    sortRowValues(workbook.getWorksheet(dataWorkBookWriter.WORKSHEET_NAME).getRow(1).values),
    [undefined, ...Object.keys(exportTripInterface)].sort(),
  );
  t.is(
    workbook.getWorksheet(dataWorkBookWriter.WORKSHEET_NAME).getRow(2).values.length,
    Object.keys(exportTripInterface).length + 1,
  );
  t.is(
    workbook.getWorksheet(dataWorkBookWriter.WORKSHEET_NAME).getRow(2).getCell(1).value,
    exportTripInterface.rpc_journey_id,
  );
});
