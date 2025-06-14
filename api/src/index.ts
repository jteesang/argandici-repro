import { createNestApplication } from './main';

export default async function handler(req, res) {
  const app = await createNestApplication();
  await app.init();

  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
