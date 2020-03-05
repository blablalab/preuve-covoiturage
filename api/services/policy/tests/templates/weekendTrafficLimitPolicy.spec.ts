import { expect } from 'chai';
import { describe } from 'mocha';

import { TripInterface, CampaignInterface } from '../../src/interfaces';
import { PolicyEngine } from '../../src/engine/PolicyEngine';
import { helper } from './helper';
import { weekendTrafficLimitPolicy } from '../../src/engine/template';
import { trips as fakeTrips } from './trips';

describe('Template: weekendTrafficLimitPolicy', () => {
  const template: CampaignInterface = {
    ...weekendTrafficLimitPolicy,
    territory_id: 1,
    status: 'active',
    start_date: new Date('2019-01-01'),
    end_date: new Date('2019-02-01'),
  };

  const trips: TripInterface[] = [...fakeTrips];

  const { up, down } = helper();
  let engine: PolicyEngine;
  let policy_id: number;
  let policy: CampaignInterface;

  before(async () => {
    ({ engine, policy } = await up(template));
    policy_id = policy._id;
  });

  after(async () => {
    await down();
  });

  it('should work', async () => {
    const results = [];
    for (const trip of trips) {
      const r = await engine.process(trip, policy);
      results.push(...r);
    }

    expect(results.filter((r) => r.amount > 0)).to.deep.members([
      { policy_id, carpool_id: 8, identity_uuid: '6', amount: 150 },
    ]);
  });
});
