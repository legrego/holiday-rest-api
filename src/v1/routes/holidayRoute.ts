import * as express from "express";
import { IHolidayQuery } from "../model/IHolidayQuery";
const Holidays = require("date-holidays");

export function createHolidayRoute(): express.Router {
    const route = express.Router();

    route.get("/", (req, res, next) => {
        const query = parseHolidayQueryFromRequest(req);

        const hd = createHolidaysObject(query);

        res.status(200).send(hd.getHolidays(query.year));
    });

    route.get("/today", (req, res, next) => {
        const query = parseHolidayQueryFromRequest(req);

        const hd = createHolidaysObject(query);

        let holiday = hd.isHoliday(new Date());

        if (!holiday && query.force) {
            holiday = hd.getHolidays(query.year)[0];
        }

        if (holiday) {
            res.status(200).send({
                isHoliday: true,
                holiday
            });
        } else {
            res.status(200).send({
                isHoliday: false
            });
        }
    });

    return route;
}

function createHolidaysObject(query: IHolidayQuery) {
    const hd = new Holidays(query.country, query.state, query.region, {
        languages: [query.language],
        timezone: query.timezone
    });

    return hd;
}

function parseHolidayQueryFromRequest(req: express.Request): IHolidayQuery {
    const country: string = req.query.country || "US";

    let state: string = req.query.state;
    if (country === "US" && !state) {
        state = "NY";
    }

    const region: string = req.query.region || "";

    const timezone: string = req.query.tz || "America/New_York";

    const language: string = req.query.lang || "en-us";

    const year: number = parseInt(req.query.year, 10) || new Date().getFullYear();

    const force: boolean = req.query.force === "true";

    return {
        country,
        state,
        region,
        timezone,
        language,
        year,
        force
    };
}
