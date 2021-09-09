import { provider } from '@ilos/common';
import { TripOperatorRepositoryProvider } from '../../providers/TripOperatorRepositoryProvider';
import { ResultInterface as Campaign } from '../../shared/policy/find.contract';

@provider()
export class GetCampaignInvolvedOperator {
  constructor(public tripOperatorRepositoryProvider: TripOperatorRepositoryProvider) {}

  async call(campaign: Campaign): Promise<number[]> {
    if (this.hasCampaignOperatorWhitelist(campaign)) {
      return campaign.global_rules
        .filter((g) => g.slug === 'operator_whitelist_filter')
        .flatMap((owf) => owf.parameters);
    }
    return this.tripOperatorRepositoryProvider.getInvoledOperators(campaign._id);
  }

  private hasCampaignOperatorWhitelist(campaign: Campaign) {
    return campaign.global_rules.find((g) => g.slug === 'operator_whitelist_filter');
  }
}
