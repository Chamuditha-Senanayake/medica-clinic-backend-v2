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
import prescriptionRouter from "./features/prescription/routes/prescription.route.js";
import diseaseRouter from "./features/disease/routes/disease.route.js";
import patientRouter from "./features/patient/routes/patient.route.js";
import noteRouter from "./features/note/routes/note.route.js";
import drugRouter from "./features/drug/routes/drug.route.js";


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
app.use(`/api/v1`, prescriptionRouter);
app.use(`/api/v1`, diseaseRouter);
app.use(`/api/v1`, patientRouter);
app.use(`/api/v1`, noteRouter);
app.use(`/api/v1`, drugRouter);

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
