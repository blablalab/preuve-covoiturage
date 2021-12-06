import { ContextType, handler, InvalidParamsException, KernelInterfaceResolver } from '@ilos/common';
import { Action } from '@ilos/core';
import { copyGroupIdFromContextMiddlewares, validateDateMiddleware } from '@pdc/provider-middleware';
import { get } from 'lodash';
import * as middlewareConfig from '../config/middlewares';
import { TripRepositoryProviderInterfaceResolver } from '../interfaces';
import { groupPermissionMiddlewaresHelper } from '../middleware/groupPermissionMiddlewaresHelper';
import { handlerConfig, ParamsInterface, ResultInterface } from '../shared/trip/export.contract';
import { alias } from '../shared/trip/export.schema';
import {
  ParamsInterface as SendExportParamsInterface,
  signature as sendExportSignature,
} from '../shared/trip/sendExport.contract';

@handler({
  ...handlerConfig,
  middlewares: [
    ...copyGroupIdFromContextMiddlewares(['territory_id', 'operator_id'], null, false),
    ...groupPermissionMiddlewaresHelper({
      territory: 'territory.trip.stats',
      operator: 'operator.trip.stats',
      registry: 'registry.trip.stats',
    }),
    ['validate', alias],
    validateDateMiddleware({
      startPath: 'date.start',
      endPath: 'date.end',
      minStart: () => new Date(new Date().getTime() - middlewareConfig.date.minStartDefault),
      maxEnd: () => new Date(new Date().getTime() - middlewareConfig.date.maxEndDefault),
    }),
  ],
})
export class ExportAction extends Action {
  constructor(
    private kernel: KernelInterfaceResolver,
    private tripRepository: TripRepositoryProviderInterfaceResolver,
  ) {
    super();
  }

  public async handle(params: ParamsInterface, context: ContextType): Promise<ResultInterface> {
    const email = get(context, 'call.user.email');
    const fullname = `${get(context, 'call.user.firstname', '')} ${get(context, 'call.user.lastname', '')}`;

    if (!email) {
      throw new InvalidParamsException('Missing user email');
    }

    console.debug(`params.operator_id ->  ${params.operator_id}`);
    console.debug(`params.territory_id -> ${params.territory_id}`);
    console.debug(`params.territory_ids_filter -> ${params.territory_ids_filter}`);

    const tz = await this.tripRepository.validateTz(params.tz);

    // use || syntax here in case we get null value from date.{start|end},
    // which will not use the default value of get()
    const start = get(params, 'date.start') || new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const end = get(params, 'date.end') || new Date();

    const buildParams: SendExportParamsInterface = {
      type: context.call.user.territory_id ? 'territory' : context.call.user.operator_id ? 'operator' : 'registry',
      from: {
        fullname,
        email,
      },
      query: {
        date: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
      format: {
        tz: tz.name,
      },
    };

    if (params.operator_id) {
      buildParams.query.operator_id = Array.isArray(params.operator_id) ? params.operator_id : [params.operator_id];
    }

    if (params.territory_ids_filter) {
      buildParams.query.territory_id = params.territory_ids_filter;
    }

    if (params.territory_id) {
      // territory_id is only set by middleware for territory group
      if (!params.territory_ids_filter) {
        buildParams.query.territory_id = [params.territory_id];
      } else {
        await this.checkTerritoryFilterIsAuthorized(params);
      }
    }

    await this.kernel.notify<SendExportParamsInterface>(sendExportSignature, buildParams, {
      channel: {
        service: 'trip',
      },
      call: {
        user: {},
      },
    });
  }

  private async checkTerritoryFilterIsAuthorized(params: ParamsInterface) {
    const child_territory_ids: number[] = await this.tripRepository.getTerritoryDescendants(params.territory_id);
    if (child_territory_ids.map((ct) => params.territory_ids_filter.indexOf(ct)).find((f) => f === -1)) {
      throw new InvalidParamsException('Invalid list of territory_ids_filter');
    }
  }
}
