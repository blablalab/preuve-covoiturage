import { handler } from '@ilos/common';
import { Action as AbstractAction } from '@ilos/core';

import { handlerConfig, ParamsInterface, ResultInterface } from '../shared/policy/simulate.contract';

import { alias } from '../shared/policy/simulate.schema';
import { PolicyEngine } from '../engine/PolicyEngine';
import { TripRepositoryProviderInterfaceResolver, IncentiveInterface } from '../interfaces';

@handler({
  ...handlerConfig,
  middlewares: [
    [
      'scope.it',
      [
        [],
        [
          (params, context): string => {
            if (
              'campaign' in params &&
              'territory_id' in params.campaign &&
              params.campaign.territory_id === context.call.user.territory_id
            ) {
              return 'incentive-campaign.create';
            }
          },
        ],
      ],
    ],
    ['validate', alias],
    'validate.rules',
    ['validate.date', ['campaign', new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), new Date()]],
  ],
})
export class SimulateAction extends AbstractAction {
  constructor(private engine: PolicyEngine, private tripRepository: TripRepositoryProviderInterfaceResolver) {
    super();
  }

  public async handle(params: ParamsInterface): Promise<ResultInterface> {
    // 1. Find campaign and start engine
    const campaign = this.engine.buildCampaign(params.campaign);

    // 2. Start a cursor to find trips
    const cursor = await this.tripRepository.findTripByPolicy(campaign);
    let done = false;
    const incentives: IncentiveInterface[] = [];
    do {
      const results = await cursor.next();
      done = results.done;
      if (results.value) {
        for (const trip of results.value) {
          // 3. For each trip, process
          incentives.push(...(await this.engine.process(campaign, trip)));
        }
      }
      // 4. Save incentives
    } while (!done);

    return incentives;
  }
}
