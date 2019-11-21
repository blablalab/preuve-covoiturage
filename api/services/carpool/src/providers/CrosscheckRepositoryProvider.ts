import { provider } from '@ilos/common';
import v4 from 'uuid/v4';
import { PostgresConnection } from '@ilos/connection-postgres';

import {
  CrosscheckRepositoryProviderInterface,
  CrosscheckRepositoryProviderInterfaceResolver,
} from '../interfaces/CrosscheckRepositoryProviderInterface';

import { PositionInterface } from '../interfaces/Carpool';

/*
 * Trip specific repository
 */
@provider({
  identifier: CrosscheckRepositoryProviderInterfaceResolver,
})
export class CrosscheckRepositoryProvider implements CrosscheckRepositoryProviderInterface {
  public readonly table = 'carpool.carpools';

  constructor(public connection: PostgresConnection) {}

  public async getTripId(data: {
    operatorTripId: number;
    datetime: Date;
    start: PositionInterface;
    end: PositionInterface;
    identityUuid: string;
  }): Promise<string> {
    let tripId: string;

    if (data.operatorTripId) {
      tripId = await this.findTripIdByOperatorTripId(data.operatorTripId);
    }

    if (!tripId && data.identityUuid && data.datetime) {
      tripId = await this.findTripIdByIdentityAndDate(data.identityUuid, data.datetime);
    }

    return tripId || v4();
  }

  protected async findTripIdByOperatorTripId(operatorTripId: number): Promise<string | null> {
    const query = {
      text: `
        SELECT trip_id as _id FROM ${this.table}
        WHERE operator_trip_id = $1::varchar
        LIMIT 1
      `,
      values: [operatorTripId],
    };
    const result = await this.connection.getClient().query(query);

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0]._id;
  }

  protected async findTripIdByIdentityAndDate(identityUuid: string, start: Date): Promise<string | null> {
    const startDateString = start.toISOString();

    const query = {
      text: `
        SELECT trip_id as _id FROM ${this.table}
          WHERE identity_uuid = $1
          AND datetime >= timestamptz '${startDateString}'::timestamptz - interval '2 hour'
          AND datetime <= timestamptz '${startDateString}'::timestamptz + interval '2 hour'
          LIMIT 1
      `,
      values: [identityUuid],
    };

    const result = await this.connection.getClient().query(query);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0]._id;
  }
}
