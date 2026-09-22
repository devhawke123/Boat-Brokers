import { Router } from "express";
import { createBookingHandler, listBookings, updateBookingStatusHandler } from "../controllers/booking.controller";

export const bookingsRouter = Router();

bookingsRouter.get("/", listBookings);
bookingsRouter.post("/", createBookingHandler);
bookingsRouter.patch("/:id/status", updateBookingStatusHandler);
