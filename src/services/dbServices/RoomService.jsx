import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

import { fetchHotels } from "./HotelService";
import { fetchCities } from "./CityService";
import { fetchCategories } from "./CategoryService";

// Helper function to convert string to slug
export const toSlug = (text) =>
  text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

// --------------------------------------------------
// Fetch all rooms with hotel, city & category info
// --------------------------------------------------
export const fetchAllRooms = async () => {
  const roomsSnapshot = await getDocs(collection(db, "rooms"));
  const hotels = await fetchHotels();
  const citiesArray = await fetchCities();
  const categoriesArray = await fetchCategories();

  // Convert arrays to objects for lookup
  const cities = citiesArray.reduce((acc, city) => {
    acc[city.value] = city.label;
    return acc;
  }, {});

  const categories = categoriesArray.reduce((acc, cat) => {
    acc[cat.id] = { name: cat.categoryName };
    return acc;
  }, {});

  const rooms = roomsSnapshot.docs.map(doc => {
    const data = doc.data();
    const hotel = hotels[data.hotelId] || { name: "Unknown Hotel", cityId: null };
    const cityName = cities[hotel.cityId] || "Unknown City";
    const categoryName = categories[data.categoryId]?.name || "Unknown Category";

    return {
      id: doc.id,
      title: data.roomName || categoryName,
      hotelName: hotel.name,
      categoryId: data.categoryId,
      hotelId: data.hotelId,
      categoryName,
      cityName,
      cityId: hotel.cityId,
      price: data.price || 0,
      image: data.image || "https://via.placeholder.com/400x300",
      amenities: data.amenities || [],
    };
  });

  return rooms;
};

// --------------------------------------------------
// Fetch rooms by category slug
// --------------------------------------------------
export const fetchRoomsByCategorySlug = async (categorySlug) => {
  if (!categorySlug || categorySlug === "all") {
    return await fetchAllRooms();
  }

  const allRooms = await fetchAllRooms();
  const normalizedSlug = categorySlug.toLowerCase().trim();

  return allRooms.filter(
    room => toSlug(room.categoryName) === normalizedSlug
  );
};

// --------------------------------------------------
// ✅ FIXED: Fetch available rooms by dates
// --------------------------------------------------
export const fetchAvailableRooms = async (
  categoryId,
  cityId,
  checkInDate,
  checkOutDate
) => {
  if (!categoryId || !cityId || !checkInDate || !checkOutDate) {
    return [];
  }

  // Convert user dates to milliseconds
  const userCheckIn = new Date(checkInDate).getTime();
  const userCheckOut = new Date(checkOutDate).getTime();

  // 1️⃣ Fetch all rooms
  const allRooms = await fetchAllRooms();

  // 2️⃣ Filter rooms by category + city
  const candidateRooms = allRooms.filter(
    (room) =>
      room.categoryId === categoryId &&
      room.cityId === cityId
  );

  // 3️⃣ Fetch confirmed bookings
  const bookingsSnap = await getDocs(
    query(
      collection(db, "bookings"),
      where("status", "==", "Confirmed")
    )
  );

  // 4️⃣ Find booked room IDs for overlapping dates
  const bookedRoomIds = new Set();

  bookingsSnap.forEach(doc => {
    const data = doc.data();

    if (!data.checkInDate || !data.checkOutDate) return;

    const bookingCheckIn = data.checkInDate.toMillis();
    const bookingCheckOut = data.checkOutDate.toMillis();

    // 🔥 Correct overlap condition
    const isOverlapping =
      userCheckIn < bookingCheckOut &&
      userCheckOut > bookingCheckIn;

    if (isOverlapping) {
      if (Array.isArray(data.roomId)) {
        data.roomId.forEach(id => bookedRoomIds.add(id));
      } else {
        bookedRoomIds.add(data.roomId);
      }
    }
  });

  // 5️⃣ Return only available rooms
  return candidateRooms.filter(
    room => !bookedRoomIds.has(room.id)
  );
};

// --------------------------------------------------
// Fetch rooms by IDs with complete data
// --------------------------------------------------
export const fetchRoomsByIds = async (roomIds) => {
  if (!roomIds || roomIds.length === 0) return [];

  try {
    const allRooms = await fetchAllRooms();
    const requestedRooms = allRooms.filter(room =>
      roomIds.includes(room.id)
    );

    console.log("fetchRoomsByIds - requested IDs:", roomIds);
    console.log("fetchRoomsByIds - found rooms:", requestedRooms);

    return requestedRooms;
  } catch (err) {
    console.error("Error in fetchRoomsByIds:", err);
    return [];
  }
};
