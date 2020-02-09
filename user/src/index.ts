import express from 'express';
import service from './service';
import { apiDef } from './app';
const app = express();
app.use(express.json());
app.use(apiDef.route, service);
app.listen(apiDef.port, () =>
  console.log(`${apiDef.name}-service listening on port ${apiDef.port}!`),
);
