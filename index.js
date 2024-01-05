const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const getConnection = require('./db_init');
const loggerMiddleware = require('./middleware/logger.middleware')
const {info, errorWithData} = require('./config/logger')

// Import Routes
//

require("dotenv").config();
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

//DB connection
//

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use(function (request, response, next) {
    response.setHeader('Cache-Control', 'no-cache, no-store');
    next();
});

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
});

// set port, listen for requests
const APP_PORT = process.env.APP_PORT;
app.use(require('express-status-monitor')());
app.disable('x-powered-by');

getConnection().then(() => {
    app.listen(APP_PORT, () => {
        info(`Server is running on port ${APP_PORT}`)
    });
}).catch((error) => {
    errorWithData("Failed to connect to the database", { error });
});

module.exports = app;