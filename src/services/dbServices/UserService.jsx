import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import Cookies from "js-cookie";

export const listenAuthUser = (setUserName, setIsLoggedIn, handleLogout) => {
  return auth.onAuthStateChanged(async (user) => {
    setIsLoggedIn(!!user);
    const token = Cookies.get("userToken");

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const name = data.userName || "User";
          const email = data.userEmail || data.email || "";

          setUserName(name);
          localStorage.setItem("userName", name);

          return { name, email }; 
        } else {
          const storedName = localStorage.getItem("userName") || "User";
          setUserName(storedName);
          return { name: storedName, email: "" };
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        const storedName = localStorage.getItem("userName") || "User";
        setUserName(storedName);
        return { name: storedName, email: "" };
      }
    } else if (token) {
      handleLogout();
      return { name: "", email: "" };
    }
  });
};

export const fetchUsersByIds = async (ids) => {
  const users = {};
  for (const uid of ids) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) users[uid] = docSnap.data();
  }
  return users;
};


export const getUserEmail = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.userEmail || data.email || "";
    }
    return "";
  } catch (err) {
    console.error("Failed to fetch user email:", err);
    return "";
  }
};

export const fetchCurrentUser = async () => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return resolve(null);

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          resolve({
            name: data.userName || "Not available",
            address: data.address || "Not available",
            contactNo: data.number || "Not available",
          });
        } else resolve(null);
      } catch (err) {
        console.error(err);
        resolve(null);
      }
    });
  });
};