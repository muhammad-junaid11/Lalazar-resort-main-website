// services/CityService.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

/**
 * Fetch all cities from Firestore
 * @returns {Array} [{ label: cityName, value: cityId }]
 */
export const fetchCities = async () => {
  try {
    const snapshot = await getDocs(collection(db, "city"));
    const cities = snapshot.docs.map(doc => ({
      label: doc.data().cityName,
      value: doc.id,
    }));
    return cities;
  } catch (err) {
    console.error("Failed to fetch cities:", err);
    return [];
  }
};
