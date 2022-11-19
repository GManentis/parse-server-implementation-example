// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

const sendMessageRateLimiterMiddleware = require("../middlewares/sendMessageRateLimiterMiddleware");

const parseServerConfig = require("../utilities/configs/parseServerConfig");
const parseDashboardConfig = require("../utilities/configs/parseDashboardConfig");

const parseDashboard = new ParseDashboard(parseDashboardConfig);


module.exports = (app) => {
    //pass ip for banning.
    app.use(function(req, res, next) {
        req.headers['x-real-ip'] = req.ip;
        next();
    });

    app.use("/parse-dashboard", parseDashboard);
    app.use("/parse/functions/login", sendMessageRateLimiterMiddleware);
    app.use(process.env.PARSE_MOUNT || '/parse', new ParseServer(parseServerConfig));

    app.use((req, res) => res.status(404).send({message:"The endpoint is not available"}));
}







