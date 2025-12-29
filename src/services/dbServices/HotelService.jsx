import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export const fetchHotels = async () => {
  const snapshot = await getDocs(collection(db, "hotel"));
  const hotels = {};
  snapshot.docs.forEach((doc) => {
    hotels[doc.id] = {
      id: doc.id,
      name: doc.data().hotelName,
      cityId: doc.data().cityId,
    };
  });
  return hotels;
};
