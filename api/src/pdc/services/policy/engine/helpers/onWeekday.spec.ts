import { anyTest as test } from '@/dev_deps.ts';

import { StatelessContext } from '../entities/Context.ts';
import { generateCarpool } from '../tests/helpers.ts';
import { onWeekday } from './onWeekday.ts';

function setup(datetime: Date) {
  return StatelessContext.fromCarpool(1, generateCarpool({ datetime }));
}

test('should return false if not in list', async (t) => {
  const ctx = setup(new Date('2022-01-01'));
  const res = onWeekday(ctx, { days: [] });
  t.is(res, false);
});

test('should return true if in list', async (t) => {
  const date = new Date('2022-01-01');
  const ctx = setup(date);
  const res = onWeekday(ctx, { days: [date.getDay()] });
  t.is(res, true);
});
