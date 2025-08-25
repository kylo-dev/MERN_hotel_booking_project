import express, { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const hotelRouter: Router = express.Router();

hotelRouter.post("/", protect, registerHotel);

export default hotelRouter;
