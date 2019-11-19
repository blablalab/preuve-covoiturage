import { promisify } from 'util';
import {
  command,
  CommandInterface,
  CommandOptionType,
  ResultType,
  KernelInterfaceResolver,
  ContextType,
} from '@ilos/common';
import { PostgresConnection, Cursor } from '@ilos/connection-postgres';

@command()
export class ProcessJourneyCommand implements CommandInterface {
  protected readonly command = 'normalization:geo';

  static readonly signature: string = 'process:journey';
  static readonly description: string = 'Push a journey from acquisition to the pipeline';
  static readonly options: CommandOptionType[] = [
    {
      signature: '-u, --database-uri <uri>',
      description: 'Connection string to the database',
      default: process.env.APP_POSTGRES_URL,
    },
    {
      signature: '-t, --table <table>',
      description: 'Source table',
      default: 'acquisition.acquisitions',
    },
    {
      signature: '-i, --id <carpoolid>',
      description: 'Select one carpool by carpool_id',
    },
    {
      signature: '-s, --startdate <startdate>',
      description: 'Select carpool with a created_at date after <startdate>',
    },
    {
      signature: '-m, --metatable <metatable>',
      description: 'Meta data to store states',
      default: 'acquisition.acquisition_metas',
    },
    {
      signature: '--tag <tag>',
      description: 'Tag of this operation',
      default: 'done',
    },
    {
      signature: '-l, --limit <limit>',
      description: 'Limit to apply',
      // tslint:disable-next-line: no-unnecessary-callback-wrapper
      coerce: (s: string) => Number(s),
    },
  ];

  constructor(protected kernel: KernelInterfaceResolver) {}

  // tslint:disable-next-line: no-shadowed-variable
  public async call(options): Promise<ResultType> {
    const readConnection = new PostgresConnection({ connectionString: options.databaseUri });
    const writeConnection = new PostgresConnection({ connectionString: options.databaseUri });
    await readConnection.up();
    await writeConnection.up();
    const readClient = await readConnection.getClient().connect();
    const writeClient = writeConnection.getClient();

    const handler = this.kernel.getContainer().getHandler({ signature: this.command });

    // create metadata table
    await writeClient.query(`
      CREATE TABLE IF NOT EXISTS ${options.metatable}
      (
        acquisition_id integer REFERENCES ${options.table} (_id),
        created_at timestamp DEFAULT NOW(),
        meta varchar
      )
    `);

    // select acquisition missing a carpool
    const query = {
      text: `
        SELECT ${options.table}._id
        FROM ${options.table}
        LEFT JOIN carpool.carpools
        ON ${options.table}._id = carpool.carpools.acquisition_id::integer
        JOIN ${options.metatable}
        ON ${options.table}._id = ${options.metatable}.acquisition_id 
        WHERE carpool.carpools.acquisition_id IS NULL
        AND meta <> $1
        LIMIT $2
      `,
      values: [options.tag, options.limit],
    };

    const cursorCb = readClient.query(new Cursor(query.text, query.values));
    const cursor = promisify(cursorCb.read.bind(cursorCb));
    let count = 0;
    const ROW_COUNT = 5;

    const context: ContextType = {
      call: {
        user: {},
      },
      channel: {
        transport: 'cli',
        service: 'proxy',
      },
    };

    do {
      console.log('loop');
      try {
        const result = await cursor(ROW_COUNT);
        count = result.length;
        console.log(result);

        await writeClient.query('BEGIN');

        for (const line of result) {
          await (<any>handler).handle(line, context);
          if (options.tag) {
            await writeClient.query({
              text: `
                INSERT INTO ${options.metatable}
                (acquisition_id, meta) VALUES ($1, $2)
              `,
              values: [line._id, options.tag],
            });
          }
          // tslint:disable-next-line: no-console
          console.info(`Operation done for ${line._id}`);
        }
      } catch (e) {
        console.log(e.stack);
        await writeClient.query('REVOKE');
      }

      await writeClient.query('COMMIT');
    } while (count !== 0);

    return 'Done!';
  }
}
