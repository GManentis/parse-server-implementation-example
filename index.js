const express = require("express");
const {ParseServer} = require("parse-server");
require("dotenv").config();
const app = express();

require("./startup/routes")(app);

const port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log('> Parse-server-implementation with dashboard running on port ' + port + '.');
});
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(app);





