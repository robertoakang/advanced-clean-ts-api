import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'babar.db.elephantsql.com',
  port: 5432,
  username: 'tyjbrjrf',
  password: 'g_mdGwwnvZn8Q9LyT4DqJ6gTMcYfnOK0',
  database: 'tyjbrjrf',
  entities: ['dist/infra/postgres/entities/index.js']
}
