// services/PaymentService.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

/**
 * Create a payment entry for a booking
 * @param {string} bookingId
 * @param {string} paymentType
 * @param {string} receipt
 */
export const createPayment = async (bookingId, paymentType, receipt = "", totalAmount = 0, advance = 0) => {
  try {
    await addDoc(collection(db, "payment"), {
      bookingId,
      label: "Advance 1",
      paidAmount: 0,
      totalAmount,
      advance,
      paymentDate: serverTimestamp(),
      paymentType,
      receiptPath: receipt,
      status: "Pending",
    });
  } catch (err) {
    console.error("Failed to create payment", err);
    throw err;
  }
};
