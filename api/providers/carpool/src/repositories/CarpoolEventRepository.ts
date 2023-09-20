import { provider } from '@ilos/common';
import { PoolClient, PostgresConnection } from '@ilos/connection-postgres';
import sql, { empty, join, raw } from 'sql-template-tag';
import { InsertableCarpoolEvent } from '../interfaces';

@provider()
export class CarpoolEventRepository {
  constructor(protected connection: PostgresConnection) {}

  public async save(data: InsertableCarpoolEvent, client?: PoolClient): Promise<void> {}
  public async syncStatus(client?: PoolClient): Promise<void> {}
}
