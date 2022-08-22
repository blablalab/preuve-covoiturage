import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { JsonRPCParam } from '~/core/entities/api/jsonRPCParam';
import { Campaign } from '~/core/entities/campaign/api-format/campaign';
import { CrudActions, DeleteResponse, JsonRpcCrud } from '~/core/services/api/json-rpc.crud';

import { CampaignInterface } from '~/core/entities/api/shared/policy/common/interfaces/CampaignInterface';
import { ParamsInterface as CreateParamsInterface } from '~/core/entities/api/shared/policy/create.contract';
import { ParamsInterface as DeleteParamsInterface } from '~/core/entities/api/shared/policy/delete.contract';
import { ResultInterface as LaunchResultInterface } from '~/core/entities/api/shared/policy/launch.contract';
import { ParamsInterface as ListParamsInterface } from '~/core/entities/api/shared/policy/list.contract';
import { ParamsInterface as PatchParamsInterface } from '~/core/entities/api/shared/policy/patch.contract';
import { CampaignReducedStats } from '~/core/entities/campaign/api-format/CampaignStats';
import { AuthenticationService } from '~/core/services/authentication/authentication.service';
import {
  ParamsInterface as CampaignStateParam,
  ResultInterface as CampaignStateResult,
  signature as campaignStateSignature,
} from '../../../../../../shared/policy/campaignState.contract';

@Injectable({
  providedIn: 'root',
})
export class CampaignApiService extends JsonRpcCrud<
  Campaign,
  Campaign,
  PatchParamsInterface['patch'],
  any,
  any,
  ListParamsInterface,
  any,
  CreateParamsInterface
> {
  constructor(http: HttpClient, protected auth: AuthenticationService) {
    super(http, 'campaign');
  }

  public launch(id: number): Observable<LaunchResultInterface> {
    const jsonRPCParam = new JsonRPCParam(`${this.method}:launch`, { _id: id });
    return this.callOne(jsonRPCParam).pipe(map((data) => data.data));
  }

  getById(id: number): Observable<Campaign> {
    return this.get({ _id: id, territory_id: this.auth.user.territory_id } as any);
  }

  loadTemplates(): Observable<Campaign[]> {
    return this.callOne(new JsonRPCParam(`${this.method}:templates`, {})).pipe(map((data) => data.data as Campaign[]));
  }

  deleteByTerritoryId(params: DeleteParamsInterface): Observable<DeleteResponse> {
    const jsonRPCParam = new JsonRPCParam(`${this.method}:${CrudActions.DELETE}`, params);
    return this.callOne(jsonRPCParam).pipe(
      map((data) => ({
        success: data.data,
        _id: params._id,
      })),
    );
  }

  stat(campaignId: number): Observable<CampaignStateResult> {
    const jsonRPCParam: JsonRPCParam<CampaignStateParam> = new JsonRPCParam(campaignStateSignature, {
      _id: campaignId,
    });
    return this.callOne(jsonRPCParam).pipe(map((data) => data.data as CampaignStateResult));
  }

  simulate(campaign: CampaignInterface): Observable<CampaignReducedStats> {
    const jsonRPCParam = new JsonRPCParam(`${this.method}:simulateOnPast`, { campaign });
    return this.callOne(jsonRPCParam).pipe(map((data) => data.data));
  }
}
