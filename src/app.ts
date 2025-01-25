import helmet from 'helmet';
import 'express-async-errors';
import express, { Application } from 'express';

const app: Application = express();

app.use(helmet());
app.use(express.json());

export default app;
