import * as express from "express";
import {createHolidayRoute} from "../src/v1/routes/holidayRoute";
const request = require("supertest");

describe("holidayRoute", () => {
    describe("GET /", () => {
        it("should return an array of holidays", () => {
            const app = express();
            const route = createHolidayRoute();
            app.use("/", route);

            return request(app)
                .get("/")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .then(response => {
                    const holidays: any[] = response.body;
                    expect(Array.isArray(holidays)).toBe(true);
                    expect(holidays.length).toBeGreaterThanOrEqual(1);
                    holidays.forEach(holiday => {
                        expect(holiday).toHaveProperty("date");
                        expect(holiday).toHaveProperty("start");
                        expect(holiday).toHaveProperty("end");
                        expect(holiday).toHaveProperty("name");
                        expect(holiday).toHaveProperty("type");
                    });
                });
        });
    });

    describe("GET /today", () => {
        it("should indicate if today is a holiday", () => {
            const app = express();
            const route = createHolidayRoute();
            app.use("/", route);

            return request(app)
                .get("/today")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .then(response => {
                    expect(response.body).toHaveProperty("isHoliday");
                });
        });
    });
});
