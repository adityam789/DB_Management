const db = require("../DBConfig/eventModel")
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const tokenHandler = require('../tokenAuth/token');

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

    router.use(tokenHandler.tokenMiddleware)

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
        if(!request.query.name && !request.query.id) { console.log("Request Query doesn't have name parameter"); response.send("Request Query doesn't have name parameter"); }
        if(request.query.name){
            await db.models.Events.update(
            { isDeleted: 1 },
            {
                where: {
                    EventTypeName: request.query.name,
                },
            }
            );
            response.json("Done Boss, softDeleted");
        }
        else{
            await db.models.Events.update(
                { isDeleted: 1 },
                {
                    where: {
                        id: request.query.id,
                    },
                }
            );
            response.json("Done Boss, softDeleted");
        }
    });

    // Update
    router.post("/update", async (request, response) => {
        // console.log(request.body.name)
        // if(!request.body.name || !request.body.state || !request.body.isDeleted || !request.body.toEdit) { console.log("Request Body doesn't have parameters huh"); response.json("Request Body doesn't have name parameter"); }
        // else{
            await db.models.Events.update(
                { isDeleted: request.body.isDeleted,
                EventTypeName: request.body.name,
                eventState: request.body.state,  
                },
                {
                    where: {
                        EventTypeName: request.body.toEdit,
                    },
                }
            );
            response.json("Done Boss, Updated");
        //}
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