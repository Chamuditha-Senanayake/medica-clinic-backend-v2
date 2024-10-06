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
import employeeRouter from "./features/employee/routes/employee.route.js";
import prescriptionRouter from "./features/prescription/routes/prescription.route.js";
import diseaseRouter from "./features/disease/routes/disease.route.js";
import patientRouter from "./features/patient/routes/patient.route.js";
import noteRouter from "./features/note/routes/note.route.js";
import drugRouter from "./features/drug/routes/drug.route.js";
import instituteRouter from "./features/institute/routes/institute.route.js";
import appointmentRouter from "./features/appointment/routes/appointment.route.js";
import notificationScheduleRouter from "./features/notificationSchedule/routes/notificationSchedule.route.js";
import billRouter from "./features/bill/routes/bill.route.js";
import dispositionRouter from "./features/disposition/routes/disposition.route.js";
import UserRouter from "./features/users/routes/user.route.js";
import analyticsRouter from "./features/analytics/routes/analytics.route.js";
import medicalCertificateRouter from "./features/medicalCertificate/routes/medicalCertificate.route.js";
import camiosRouter from "./features/camios/routes/camios.route.js";
import { validateToken } from "./utils/gas.js";
import analyticsRoutes from "./features/analytics/routes/analystics-routes.js";
import appVersionRoutes from "./features/app-version/routes/app-version-routes.js";
import appointmentRecordsRoutes from "./features/appointment/routes/appointment-records-routes.js";
import appointmentRoutes from "./features/appointment/routes/appointment-routes.js";
import appointmentVitalRoutes from "./features/appointment/routes/appointment-vital-routes.js";
import medicalBillRoutes from "./features/bill/routes/medical-bill-routes.js";
import doctorNoteRoutes from "./features/doctor/routes/doctor-notes-routes.js";
import doctorRoutes from "./features/doctor/routes/doctor-routes.js";
import employeeRoutes from "./features/employee/routes/employee-routes.js";
import imageRoutes from "./features/images/routes/image-routes.js";
import instituteBranchRoutes from "./features/institute/routes/institute-branch-router.js";
import institutesRoutes from "./features/institute/routes/institute-routes.js";
import investigationRoutes from "./features/investigation/routes/investigation-routes.js";
import medicalCertificateRoutes from "./features/medicalCertificate/routes/medical-certificate-routes.js";
import smsRoutes from "./features/sms/routes/sms-routes.js";
import ratingRoutes from "./features/rating/routes/ratings-routes.js";
import specializationsRoutes from "./features/specialization/routes/specializations-routes.js";
import otpRoutes from "./features/otp/routes/otp-routes.js";
import pharmacyRoutes from "./features/pharmacy/routes/pharmacy-routes.js";
import referralLetterRoutes from "./features/referralLetter/routes/referral-letter-routes.js";
import sessionRoutes from "./features/session/routes/session-routes.js";
import serviceFeeRoutes from "./features/service-fee/routes/service-fee-routes.js";

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

app.use(validateToken);
app.use(`/api/v1`, doctorRouter);
app.use(`/api/v1`, nurseRouter);
app.use(`/api/v1`, prescriptionRouter);
app.use(`/api/v1`, diseaseRouter);
app.use(`/api/v1`, patientRouter);
app.use(`/api/v1`, noteRouter);
app.use(`/api/v1`, drugRouter);
app.use(`/api/v1`, employeeRouter);
app.use(`/api/v1`, instituteRouter);
app.use(`/api/v1`, appointmentRouter);
app.use(`/api/v1`, notificationScheduleRouter);
app.use(`/api/v1`, billRouter);
app.use(`/api/v1`, dispositionRouter);
app.use(`/api/v1`, UserRouter);
app.use(`/api/v1`, analyticsRouter);
app.use(`/api/v1`, medicalCertificateRouter);
app.use(`/api/v1`, camiosRouter);


app.use(`/api/v1`, appVersionRoutes);

app.use(`/api/v1`, appointmentVitalRoutes);
app.use(`/api/v1`, medicalBillRoutes);
app.use(`/api/v1`, doctorNoteRoutes);
app.use(`/api/v1`, doctorRoutes);
app.use(`/api/v1`, imageRoutes);
app.use(`/api/v1`, institutesRoutes);
app.use(`/api/v1`, investigationRoutes);
app.use(`/api/v1`, medicalCertificateRoutes);
app.use(`/api/v1`, otpRoutes);
app.use(`/api/v1`, patientRouter);
app.use(`/api/v1`, pharmacyRoutes);
app.use(`/api/v1`, prescriptionRouter);
app.use(`/api/v1`, referralLetterRoutes);


//admin apis
app.use(`/api/v1/appointments`, appointmentRoutes);
app.use(`/api/v1/sessions`, sessionRoutes);
app.use(`/api/v1/analytics`, analyticsRoutes);
app.use(`/api/v1/employee`, employeeRoutes);
app.use(`/api/v1/appointment-records`, appointmentRecordsRoutes);
app.use(`/api/v1/institute-branch`, instituteBranchRoutes);
app.use(`/api/v1/sms`, smsRoutes);
app.use(`/api/v1/specializations`, specializationsRoutes);
app.use(`/api/v1/ratings`, ratingRoutes);
app.use(`/api/v1/service-fee`, serviceFeeRoutes);



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
