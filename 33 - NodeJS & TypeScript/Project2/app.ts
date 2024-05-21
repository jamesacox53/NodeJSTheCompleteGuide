import express from 'express';

import todosRoutes from './routes/todos.js'

const app = express();

app.use(todosRoutes)

app.listen(3000);