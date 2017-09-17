import * as express from 'express';
const RateLimit = require('express-rate-limit');
import { createHolidayRoute } from './routes/holidayRoute';

let port: number;

const envPort = parseInt(process.env.PORT, 10);

if (isNaN(envPort)) {
    port = 3000;
} else {
    port = envPort;
}

const app: express.Express = express();

if (process.env.BEHIND_PROXY) {
    app.enable('trust proxy');
}

// Limit each IP to 
const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes 
    max: 100, // limit each IP to 100 requests per windowMs 
    delayMs: 0 // disable delaying - full speed until the max limit is reached 
});

app.use(limiter);

app.use('/holiday', createHolidayRoute());


app.listen(port, () => {
    console.log('holiday-api running on port ' + port);
});