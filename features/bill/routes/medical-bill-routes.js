import { Router } from "express";
import {
  billDataGet,
  billDataSave,
  billGet,
  billRemarkGet,
  billRemarkSave,
  billUpdatePaymentStatus,
  getMedicalBill,
  refundBillDataGet,
  refundBillDataSave,
  saveMedicalBill,
} from "../controllers/medical-bill-controller.js";

const medicalBillRoutes = Router();

medicalBillRoutes.post("/save", saveMedicalBill);
medicalBillRoutes.post("/get", getMedicalBill);

medicalBillRoutes.post(`/bill-data/save`, billDataSave);

medicalBillRoutes.get(`/bill-data/get/:billId`, billDataGet);

medicalBillRoutes.get(`/bill/get/`, billGet);

medicalBillRoutes.post(`/bill/update-payment-status`, billUpdatePaymentStatus);

medicalBillRoutes.post(`/bill-remark/save`, billRemarkSave);

medicalBillRoutes.post(`/bill-remark/get`, billRemarkGet);

medicalBillRoutes.post(`/refund-bill-data/save`, refundBillDataSave);

medicalBillRoutes.get(`/refund-bill-data/get/:billId`, refundBillDataGet);

// medicalBillRoutes.post(`/service-fee/save`, serviceFeeSave);

export default medicalBillRoutes;
