import { useState, useEffect } from "react";
import { auth, db } from "../services/Firebase/Firebase"; // Adjust path
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Custom hook to fetch logged-in user's data from 'users' collection
 */
export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "users"), where("userEmail", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            
            // ⚡ Map Firestore fields to match ThirdStep expected fields
            setUserData({
              name: data.userName || user.email.split("@")[0] || "User",
              contactNo: data.number || "N/A",   // <-- number → contactNo
              address: data.address || "N/A",
              userEmail: data.userEmail,
            });
          } else {
            // fallback if user doc not found
            setUserData({
              name: user.email.split("@")[0] || "User",
              contactNo: "N/A",
              address: "N/A",
              userEmail: user.email,
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { userData, isLoading };
};
