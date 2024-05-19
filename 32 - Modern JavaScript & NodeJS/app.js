import express from 'express';

import { resHandler, resHandler2 } from './response-handler.js';

const app = express();

app.get('/', resHandler);
app.get('/2', resHandler2);

app.listen(3000);
