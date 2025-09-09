// // src/useIngredients.js
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// export function useIngredients() {
//   const [ingredients, setIngredients] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchIngredients() {
//       const snapshot = await getDocs(collection(db, "ingredients"));
//       const data = {};
//       snapshot.forEach((doc) => {
//         data[doc.id] = doc.data();
//       });
//       setIngredients(data);
//       setLoading(false);
//     }
//     fetchIngredients();
//   }, []);

//   return { ingredients, loading };
// }

