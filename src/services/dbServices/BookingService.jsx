// services/BookingService.js
import { collection, addDoc, getDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

/**
 * Create a new booking
 * @param {string} userId
 * @param {object} bookingData - { checkInDate, checkOutDate, persons, roomId, paymentMethod }
 * @returns {string} bookingId
 */
export const createBooking = async (userId, bookingData) => {
  try {
    const bookingRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      userId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return bookingRef.id;
  } catch (err) {
    console.error("Failed to create booking", err);
    throw err;
  }
};