import { handler, ContextType } from '@ilos/common';
import { Action as AbstractAction } from '@ilos/core';
import { copyFromContextMiddleware, hasPermissionByScopeMiddleware } from '@pdc/provider-middleware';

import { TerritoryRepositoryProviderInterfaceResolver } from '../interfaces/TerritoryRepositoryProviderInterface';
import { handlerConfig, ParamsInterface } from '../shared/territory/patchContacts.contract';
import { alias } from '../shared/territory/patchContacts.schema';
import { TerritoryDbMetaInterface } from '..//shared/territory/common/interfaces/TerritoryDbMetaInterface';

@handler({
  ...handlerConfig,
  middlewares: [
    copyFromContextMiddleware('call.user.territory_id', '_id'),
    hasPermissionByScopeMiddleware('registry.territory.patchContacts', [
      'territory.territory.patchContacts',
      'call.user.territory_id',
      '_id',
    ]),
    ['validate', alias],
  ],
})
export class PatchContactsTerritoryAction extends AbstractAction {
  constructor(private territoryRepository: TerritoryRepositoryProviderInterfaceResolver) {
    super();
  }

  public async handle(params: ParamsInterface, context: ContextType): Promise<TerritoryDbMetaInterface> {
    if (context.call.user.territory_id) {
      params._id = context.call.user.territory_id;
    }
    // TODO : ResultInterface as repository return interface
    // throw new Error('to migrate with new Result Interface');

    return this.territoryRepository.patchContacts(params._id, params.patch);
  }
}
