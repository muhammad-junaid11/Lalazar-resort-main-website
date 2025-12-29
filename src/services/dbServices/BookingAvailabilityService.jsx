// services/dbServices/BookingAvailabilityService.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

/**
 * Get all booked room IDs that overlap with the given date range
 * @param {string|Date} checkInDate - User's desired check-in date
 * @param {string|Date} checkOutDate - User's desired check-out date
 * @returns {Promise<Set<string>>} Set of room IDs that are booked during the specified period
 */
export const getBookedRoomIds = async (checkInDate, checkOutDate) => {
  try {
    // Convert input dates to Date objects if they're strings
    const userCheckIn = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate;
    const userCheckOut = typeof checkOutDate === 'string' ? new Date(checkOutDate) : checkOutDate;

    // Fetch all confirmed bookings
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("status", "==", "Confirmed")
    );
    
    const bookingsSnapshot = await getDocs(bookingsQuery);
    
    const bookedRoomIds = new Set();

    bookingsSnapshot.forEach((doc) => {
      const booking = doc.data();
      
      // Convert Firestore timestamps to Date objects
      let bookingCheckIn, bookingCheckOut;
      
      // Handle different date formats
      if (booking.checkInDate?.seconds) {
        bookingCheckIn = new Date(booking.checkInDate.seconds * 1000);
      } else if (booking.checkInDate) {
        bookingCheckIn = new Date(booking.checkInDate);
      }
      
      if (booking.checkOutDate?.seconds) {
        bookingCheckOut = new Date(booking.checkOutDate.seconds * 1000);
      } else if (booking.checkOutDate) {
        bookingCheckOut = new Date(booking.checkOutDate);
      }

      // Check if dates overlap
      // Two date ranges overlap if: (StartA < EndB) AND (EndA > StartB)
      if (bookingCheckIn && bookingCheckOut) {
        const hasOverlap = userCheckIn < bookingCheckOut && userCheckOut > bookingCheckIn;
        
        if (hasOverlap) {
          // Handle both single roomId and array of roomIds
          if (Array.isArray(booking.roomId)) {
            booking.roomId.forEach(id => bookedRoomIds.add(id));
          } else if (booking.roomId) {
            bookedRoomIds.add(booking.roomId);
          }
        }
      }
    });

    return bookedRoomIds;
  } catch (error) {
    console.error("Error fetching booked rooms:", error);
    throw new Error("Failed to check room availability");
  }
};

/**
 * Filter out booked rooms from a list of available rooms
 * @param {Array} rooms - Array of room objects
 * @param {string|Date} checkInDate
 * @param {string|Date} checkOutDate
 * @returns {Promise<Array>} Filtered array of available rooms
 */
export const filterAvailableRooms = async (rooms, checkInDate, checkOutDate) => {
  try {
    const bookedRoomIds = await getBookedRoomIds(checkInDate, checkOutDate);
    
    // Filter out rooms that are in the booked set
    const availableRooms = rooms.filter(room => !bookedRoomIds.has(room.id));
    
    console.log(`Total rooms: ${rooms.length}, Booked: ${bookedRoomIds.size}, Available: ${availableRooms.length}`);
    
    return availableRooms;
  } catch (error) {
    console.error("Error filtering available rooms:", error);
    throw error;
  }
};

/**
 * Check if a specific room is available for the given dates
 * @param {string} roomId
 * @param {string|Date} checkInDate
 * @param {string|Date} checkOutDate
 * @returns {Promise<boolean>} true if available, false if booked
 */
export const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
  try {
    const bookedRoomIds = await getBookedRoomIds(checkInDate, checkOutDate);
    return !bookedRoomIds.has(roomId);
  } catch (error) {
    console.error("Error checking room availability:", error);
    throw error;
  }
};