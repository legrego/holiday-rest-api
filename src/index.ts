import * as express from 'express';
import { createHolidayRoute as createV1HolidayRoute } from './v1/routes/holidayRoute';

let port: number;

const envPort = parseInt(process.env.PORT, 10);

if (isNaN(envPort)) {
    port = 8010;
} else {
    port = envPort;
}

const app: express.Express = express();

app.enable('trust proxy');

app.use('/v1/holiday', createV1HolidayRoute());

app.listen(port, () => {
    console.log('holiday-api running on port ' + port);
});