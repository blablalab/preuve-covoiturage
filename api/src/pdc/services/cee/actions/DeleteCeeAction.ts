import { ContextType, handler } from "@/ilos/common/index.ts";
import { Action as AbstractAction } from "@/ilos/core/index.ts";

import { handlerConfig, ParamsInterface, ResultInterface } from "../contracts/deleteApplication.contract.ts";

import { alias } from "../contracts/deleteApplication.schema.ts";

import { getOperatorIdOrFail } from "../helpers/getOperatorIdOrFail.ts";
import { CeeRepositoryProviderInterfaceResolver } from "../interfaces/index.ts";

@handler({
  ...handlerConfig,
  middlewares: [["validate", alias]],
})
export class DeleteCeeAction extends AbstractAction {
  constructor(
    protected ceeRepository: CeeRepositoryProviderInterfaceResolver,
  ) {
    super();
  }

  public async handle(
    params: ParamsInterface,
    context: ContextType,
  ): Promise<ResultInterface> {
    const operator_id = getOperatorIdOrFail(context);
    await this.ceeRepository.deleteCeeByUuid(operator_id, params.uuid);
  }
}
