import { Pool, QueryResult, PoolConfig } from 'pg';

const schema = process.env.DB_SCHEMA ? process.env.DB_SCHEMA : 'public';
console.log(`SCHEMA set to = ${schema}`);

class Db {
  private static instance: Pool;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): Pool {
    if (!Db.instance) {
      const config: PoolConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        // eslint-disable-next-line @typescript-eslint/camelcase
        statement_timeout: 30000,
      };
      console.debug('Pool config ', { config });
      const db = new Pool(config);

      db.on('error', function (err, client) {
        console.error('Idle client error. ', err.message, err.stack);
        console.error('client: ' + client);
      });

      Db.instance = db;
    }

    return Db.instance;
  }
}

const pool = Db.getInstance();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = async (text: string, params: any[]): Promise<QueryResult> => {
  const start = Date.now();

  console.debug('executing query', { text, params });

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await pool.query(`SET SCHEMA '${schema}'`, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: QueryResult = await pool.query(text, params);

  const duration = Date.now() - start;
  console.debug(' -> executed query', { text, duration, rows: result.rowCount });

  return result;
};

export default query;
export const db = pool;
export const dbSchema = schema;
