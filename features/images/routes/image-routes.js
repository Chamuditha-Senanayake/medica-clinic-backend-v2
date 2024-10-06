import { Router } from "express";
import { getImage } from "../controller/image-controller.js";


const imageRoutes = Router();

imageRoutes.post("/load-image", getImage);


export default imageRoutes;
