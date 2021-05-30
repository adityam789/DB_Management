const db = require("../DBConfig/eventModel")
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();

let ExcelData = require('../DataFiles/excelData');

// Database Connection
(async () => {
    await db.authenticate();
    console.log("Connection has been established successfully.");
})().catch((e) => {
    // Deal with the fact the chain failed
    console.error("Unable to connect to the database:", e);
});
db.sync();

let routes = (app) => {
    //TODO: Get db.length
    router.get("/pgLength", async(request, response) => {
        response.json(200);
    });

    // Fetch All Events
    router.get("", async (request, response) => {
        if(request.query.search){
            let selectedEvents = await db.models.Events.findAll({
                where: {
                    EventTypeName: request.query.search,
                    isDeleted: 0,
                },
                limit: 10,
            });
            return response.json(selectedEvents);
        }
        else if(request.query.page){
            // TODO: Type Check
            let pageStart = request.query.page * 20 || 0
            let pageEnd = request.query.page * 20 + 20 || 20
            var events = await db.models.Events.findAll({
                where: {
                    isDeleted: 0,
                    id: {
                        [Op.gte]: pageStart + 1,
                        [Op.lte]: pageEnd,
                    },
                }
            });
            response.json(events); 
        }
        else{
            let Allevents = await db.models.Events.findAndCountAll({
                where: {
                    isDeleted: 0
                },    
            });
            response.json(Allevents);
        }
    });

    // Search Events with typeName
    // router.post("/search", async (request, response) => {
    //     let selectedEvents = await db.models.Events.findAll({
    //     where: {
    //         EventTypeName: request.body.name,
    //         isDeleted: 0,
    //     },
    //     });
    //     response.json(selectedEvents);
    // });

    // Add an eventType
    router.route("").post(async (request, response) => {
        let event = await db.models.Events.create({
            EventTypeName: request.query.name,
        });
        response.json(event);
    });

    // HardDelete an eventType
    router.delete("/hard", async (request, response) => {
        if(!request.query.name) { console.log("Request Query doesn't have name parameter"); response.send("Request Query doesn't have name parameter"); }
        await db.models.Events.destroy({
        where: {
            EventTypeName: request.query.name,
        },
        });
        response.json("Done Boss, hardDeleted");
    });

    // softDelete an eventType
    router.delete("", async (request, response) => {
        if(!request.query.name) { console.log("Request Query doesn't have name parameter"); response.send("Request Query doesn't have name parameter"); }
        await db.models.Events.update(
        { isDeleted: 1 },
        {
            where: {
            EventTypeName: request.query.name,
            },
        }
        );
        response.json("Done Boss, softDeleted");
    });

    router.post("/ExcelData", async (request, response) => {
        for (let i = 0; i < ExcelData.length; ++i) {
          db.models.Events.create({ EventTypeName: ExcelData[i].name });
        }
        response.end();
    });

    app.use("/events", router);
};

module.exports = routes