import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import statusMonitor from "express-status-monitor";
import helmet from "helmet";
import { errorWithData, info } from "./config/logger.js";
import getConnection from "./db_init.js";
import loggerMiddleware from "./middleware/logger.middleware.js";

// Import Routes
import doctorRouter from "./features/doctor/routes/doctor.route.js";
import nurseRouter from "./features/nurse/routes/nurse.route.js";


dotenv.config();

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
  response.setHeader("Cache-Control", "no-cache, no-store");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

app.use(`/api/v1`, doctorRouter);
app.use(`/api/v1`, nurseRouter);

// set port, listen for requests
const APP_PORT = process.env.APP_PORT;

app.use(statusMonitor());
app.disable("x-powered-by");

getConnection()
  .then(() => {
    app.listen(APP_PORT, () => {
      info(`Server is running on port ${APP_PORT}`);
    });
  })
  .catch((error) => {
    errorWithData("Failed to connect to the database", { error });
  });

export default app;
