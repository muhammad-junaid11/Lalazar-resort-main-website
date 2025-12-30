import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export const getBookedRoomIds = async (checkInDate, checkOutDate) => {
  try {

    const userCheckIn = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate;
    const userCheckOut = typeof checkOutDate === 'string' ? new Date(checkOutDate) : checkOutDate;


    const bookingsQuery = query(
      collection(db, "bookings"),
      where("status", "==", "Confirmed")
    );
    
    const bookingsSnapshot = await getDocs(bookingsQuery);
    
    const bookedRoomIds = new Set();

    bookingsSnapshot.forEach((doc) => {
      const booking = doc.data();

      let bookingCheckIn, bookingCheckOut;
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

      if (bookingCheckIn && bookingCheckOut) {
        const hasOverlap = userCheckIn < bookingCheckOut && userCheckOut > bookingCheckIn;
        
        if (hasOverlap) {
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


export const filterAvailableRooms = async (rooms, checkInDate, checkOutDate) => {
  try {
    const bookedRoomIds = await getBookedRoomIds(checkInDate, checkOutDate);
    const availableRooms = rooms.filter(room => !bookedRoomIds.has(room.id));
    console.log(`Total rooms: ${rooms.length}, Booked: ${bookedRoomIds.size}, Available: ${availableRooms.length}`);
    
    return availableRooms;
  } catch (error) {
    console.error("Error filtering available rooms:", error);
    throw error;
  }
};


export const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
  try {
    const bookedRoomIds = await getBookedRoomIds(checkInDate, checkOutDate);
    return !bookedRoomIds.has(roomId);
  } catch (error) {
    console.error("Error checking room availability:", error);
    throw error;
  }
};