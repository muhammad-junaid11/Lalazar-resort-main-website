import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export const fetchCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, "roomCategory"));
    const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return categories; 
  } catch (err) {
    console.error(err);
    return []; 
  }
};
